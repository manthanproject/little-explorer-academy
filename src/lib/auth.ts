import { supabase } from './supabase';
import type { StudentProfile } from '@/contexts/GameContext';

export interface AuthUser extends StudentProfile {
  email: string;
  biometricCredentialId?: string;
}

interface RegisterInput {
  name: string;
  className: string;
  division: string;
  rollNo: number;
  email: string;
  password: string;
  avatar?: string;
}

interface RegisterResult {
  ok: boolean;
  error?: string;
  user?: AuthUser;
}

const AVATARS = ['👦', '👧', '🧒', '🙂'];

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizeClassName(value: string) {
  const level = value.match(/[123]/)?.[0];
  return level ? `Class ${level}` : value.trim();
}

function randomBytes(length = 32) {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return arr;
}

function utf8Encode(text: string) {
  return new TextEncoder().encode(text);
}

function toBase64Url(bytes: Uint8Array) {
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(base64url: string) {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '==='.slice((base64.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function hasBiometricSupport() {
  return typeof window !== 'undefined' && !!window.PublicKeyCredential && !!navigator.credentials;
}

function profileToAuthUser(profile: Record<string, unknown>): AuthUser {
  return {
    id: profile.id as string,
    name: profile.name as string,
    class: profile.class as string,
    division: profile.division as string,
    rollNo: profile.roll_no as number,
    avatar: profile.avatar as string,
    email: profile.email as string,
    biometricCredentialId: (profile.biometric_credential_id as string) || undefined,
  };
}

const BIOMETRIC_EMAIL_KEY = 'lea_biometric_email';
const BIOMETRIC_TOKEN_KEY = 'lea_biometric_token';

// Store credentials locally for biometric re-auth
export function saveBiometricCredentials(email: string, password: string) {
  localStorage.setItem(BIOMETRIC_EMAIL_KEY, email);
  localStorage.setItem(BIOMETRIC_TOKEN_KEY, btoa(password));
}

function getBiometricCredentials(): { email: string; password: string } | null {
  const email = localStorage.getItem(BIOMETRIC_EMAIL_KEY);
  const token = localStorage.getItem(BIOMETRIC_TOKEN_KEY);
  if (!email || !token) return null;
  try {
    return { email, password: atob(token) };
  } catch {
    return null;
  }
}

export async function registerBiometric(user: AuthUser, password: string): Promise<RegisterResult> {
  if (!hasBiometricSupport()) {
    return { ok: false, error: 'Face/Fingerprint login is not supported on this device.' };
  }

  try {
    const credential = (await navigator.credentials.create({
      publicKey: {
        challenge: randomBytes(32),
        rp: { name: 'Little Explorer Academy' },
        user: {
          id: utf8Encode(user.id),
          name: user.email,
          displayName: user.name,
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' },
          { alg: -257, type: 'public-key' },
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'preferred',
        },
        timeout: 60000,
        attestation: 'none',
      },
    })) as PublicKeyCredential | null;

    if (!credential || !(credential.rawId instanceof ArrayBuffer)) {
      return { ok: false, error: 'Biometric registration failed.' };
    }

    const credentialId = toBase64Url(new Uint8Array(credential.rawId));

    // Save credential ID to Supabase
    const { error } = await supabase
      .from('student_profiles')
      .update({ biometric_credential_id: credentialId })
      .eq('id', user.id);

    if (error) {
      return { ok: false, error: 'Failed to save biometric data.' };
    }

    // Save credentials locally for biometric re-auth
    saveBiometricCredentials(user.email, password);

    const updatedUser = { ...user, biometricCredentialId: credentialId };
    return { ok: true, user: updatedUser };
  } catch {
    return { ok: false, error: 'Biometric setup was cancelled or failed.' };
  }
}

export async function loginWithBiometric(email?: string): Promise<RegisterResult> {
  if (!hasBiometricSupport()) {
    return { ok: false, error: 'Face/Fingerprint login is not supported on this device.' };
  }

  // Find the user's profile to get the credential ID
  let profile: Record<string, unknown> | null = null;
  const storedCreds = getBiometricCredentials();
  const lookupEmail = email ? normalizeEmail(email) : storedCreds?.email;

  if (lookupEmail) {
    const { data } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('email', lookupEmail)
      .single();
    profile = data;
  } else {
    // Try to get from current session
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      profile = data;
    }
  }

  if (!profile) {
    return { ok: false, error: 'No biometric account found on this device. Please login with password first.' };
  }
  if (!profile.biometric_credential_id) {
    return { ok: false, error: 'Biometric login is not enabled for this account yet.' };
  }

  try {
    const assertion = (await navigator.credentials.get({
      publicKey: {
        challenge: randomBytes(32),
        allowCredentials: [
          {
            id: fromBase64Url(profile.biometric_credential_id as string),
            type: 'public-key',
          },
        ],
        userVerification: 'preferred',
        timeout: 60000,
      },
    })) as PublicKeyCredential | null;

    if (!assertion) {
      return { ok: false, error: 'Biometric verification failed.' };
    }

    // Check if we have an active session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      // No active session — re-authenticate using stored credentials
      if (storedCreds) {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: storedCreds.email,
          password: storedCreds.password,
        });
        if (authError) {
          return { ok: false, error: 'Session expired and re-login failed. Please login with password.' };
        }
      } else {
        return { ok: false, error: 'Session expired. Please login with password first.' };
      }
    }

    return { ok: true, user: profileToAuthUser(profile) };
  } catch {
    return { ok: false, error: 'Biometric verification was cancelled or failed.' };
  }
}

export async function registerUser(input: RegisterInput): Promise<RegisterResult> {
  const email = normalizeEmail(input.email);
  const className = normalizeClassName(input.className);
  const division = input.division.trim().toUpperCase();

  if (!input.name.trim() || !className || !division || !input.rollNo || !email || !input.password) {
    return { ok: false, error: 'Please fill all required fields.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Enter a valid email address.' };
  }
  if (input.password.length < 6) {
    return { ok: false, error: 'Password must be at least 6 characters.' };
  }

  // Check duplicate roll number
  const { data: existing } = await supabase
    .from('student_profiles')
    .select('id')
    .eq('class', className)
    .eq('division', division)
    .eq('roll_no', input.rollNo)
    .maybeSingle();

  if (existing) {
    return { ok: false, error: 'This class/division/roll number already exists.' };
  }

  // Sign up with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: input.password,
  });

  if (authError || !authData.user) {
    if (authError?.message?.includes('already registered')) {
      return { ok: false, error: 'This email is already registered.' };
    }
    return { ok: false, error: authError?.message || 'Registration failed.' };
  }

  const userId = authData.user.id;
  const avatar = input.avatar || AVATARS[Math.floor(Math.random() * AVATARS.length)];

  // Insert student profile
  const { error: profileError } = await supabase.from('student_profiles').insert({
    id: userId,
    name: input.name.trim(),
    class: className,
    division,
    roll_no: input.rollNo,
    avatar,
    email,
  });

  if (profileError) {
    return { ok: false, error: profileError.message };
  }

  // Insert initial game progress
  await supabase.from('game_progress').insert({
    user_id: userId,
    completed_stations: [],
    stars: 0,
    current_island: null,
    current_station: 0,
    earned_rewards: [],
  });

  const user: AuthUser = {
    id: userId,
    name: input.name.trim(),
    class: className,
    division,
    rollNo: input.rollNo,
    avatar,
    email,
  };

  return { ok: true, user };
}

export async function loginWithPassword(identifier: string, password: string): Promise<RegisterResult> {
  const email = normalizeEmail(identifier);

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    if (authError?.message?.includes('Invalid login')) {
      return { ok: false, error: 'Invalid email or password.' };
    }
    return { ok: false, error: authError?.message || 'Login failed.' };
  }

  const { data: profile } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (!profile) {
    return { ok: false, error: 'Profile not found. Please register first.' };
  }

  return { ok: true, user: profileToAuthUser(profile) };
}

export async function getSession(): Promise<AuthUser | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { data: profile } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (!profile) return null;

  return profileToAuthUser(profile);
}

export async function logoutUser(): Promise<void> {
  await supabase.auth.signOut();
}

export function toStudentProfile(user: AuthUser): StudentProfile {
  return {
    id: user.id,
    name: user.name,
    class: user.class,
    division: user.division,
    rollNo: user.rollNo,
    avatar: user.avatar,
    email: user.email,
  };
}
