import type { StudentProfile } from '@/contexts/GameContext';

export interface AuthUser extends StudentProfile {
  email: string;
  password: string;
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

const STORAGE_KEY = 'lea_users_v1';
const LAST_USER_KEY = 'lea_last_user_id';
const AVATARS = ['👦', '👧', '🧒', '🙂'];

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}


function normalizeClassName(value: string) {
  const level = value.match(/[123]/)?.[0];
  return level ? `Class ${level}` : value.trim();
}

function randomId() {
  return `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function utf8Encode(text: string) {
  return new TextEncoder().encode(text);
}

function randomBytes(length = 32) {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return arr;
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

export function getUsers(): AuthUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUsers(users: AuthUser[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function rememberUser(userId: string) {
  localStorage.setItem(LAST_USER_KEY, userId);
}

export function getRememberedUser() {
  const rememberedId = localStorage.getItem(LAST_USER_KEY);
  if (!rememberedId) return null;
  return getUsers().find((user) => user.id === rememberedId) || null;
}

export function clearRememberedUser() {
  localStorage.removeItem(LAST_USER_KEY);
}

export function findUserByIdentifier(identifier: string) {
  const key = normalizeEmail(identifier);
  return getUsers().find((u) => u.email === key) || null;
}

export function registerUser(input: RegisterInput): RegisterResult {
  const users = getUsers();
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

  const duplicateEmail = users.some((u) => u.email === email);
  if (duplicateEmail) return { ok: false, error: 'This email is already registered.' };


  const duplicateRoll = users.some(
    (u) =>
      u.class.toLowerCase() === className.toLowerCase() &&
      u.division.toLowerCase() === division.toLowerCase() &&
      u.rollNo === input.rollNo,
  );
  if (duplicateRoll) {
    return { ok: false, error: 'This class/division/roll number already exists.' };
  }

  const user: AuthUser = {
    id: randomId(),
    name: input.name.trim(),
    class: className,
    division,
    rollNo: input.rollNo,
    avatar: input.avatar || AVATARS[users.length % AVATARS.length],
    email,
    password: input.password,
  };

  saveUsers([...users, user]);
  return { ok: true, user };
}

export function loginWithPassword(identifier: string, password: string): RegisterResult {
  const user = findUserByIdentifier(identifier);
  if (!user) return { ok: false, error: 'Account not found. Please register first.' };
  if (user.password !== password) return { ok: false, error: 'Invalid password.' };
  return { ok: true, user };
}

export function hasBiometricSupport() {
  return typeof window !== 'undefined' && !!window.PublicKeyCredential && !!navigator.credentials;
}

export async function registerBiometric(user: AuthUser): Promise<RegisterResult> {
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
    const users = getUsers();
    const updated = users.map((u) =>
      u.id === user.id ? { ...u, biometricCredentialId: credentialId } : u,
    );
    saveUsers(updated);

    const updatedUser = updated.find((u) => u.id === user.id) || user;
    return { ok: true, user: updatedUser };
  } catch {
    return { ok: false, error: 'Biometric setup was cancelled or failed.' };
  }
}

export async function loginWithBiometric(identifier: string): Promise<RegisterResult> {
  const user = identifier ? findUserByIdentifier(identifier) : getRememberedUser();
  if (!user) return { ok: false, error: 'Account not found for biometric login.' };
  if (!user.biometricCredentialId) {
    return { ok: false, error: 'Biometric login is not enabled for this account yet.' };
  }
  if (!hasBiometricSupport()) {
    return { ok: false, error: 'Face/Fingerprint login is not supported on this device.' };
  }

  try {
    const assertion = (await navigator.credentials.get({
      publicKey: {
        challenge: randomBytes(32),
        allowCredentials: [
          {
            id: fromBase64Url(user.biometricCredentialId),
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

    return { ok: true, user };
  } catch {
    return { ok: false, error: 'Biometric verification was cancelled or failed.' };
  }
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
