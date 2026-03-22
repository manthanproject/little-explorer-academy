import { motion } from 'framer-motion';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import GuideCharacter from '@/components/GuideCharacter';
import BiometricAnimation from '@/components/BiometricAnimation';
import { Fingerprint, ScanFace } from 'lucide-react';
import {
  hasBiometricSupport,
  loginWithBiometric,
  loginWithPassword,
  registerUser,
  saveBiometricCredentials,
  setLastPassword,
  toStudentProfile,
} from '@/lib/auth';

type AuthMode = 'login' | 'register';

export default function LoginScreen() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [biometricAnim, setBiometricAnim] = useState<'face' | 'fingerprint' | null>(null);

  const [emailLogin, setEmailLogin] = useState('');
  const [password, setPassword] = useState('');

  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [division, setDivision] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [email, setEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
  const { login } = useGame();

  const biometricSupported = hasBiometricSupport();

  const helpMessage = mode === 'register'
    ? 'First time here? Please create your profile first. 😊'
    : 'Login using Email + Password, or Face/Fingerprint.';

  const onLoginWithPassword = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setBusy(true);

    const result = await loginWithPassword(emailLogin, password);
    setBusy(false);

    if (!result.ok || !result.user) {
      setError(result.error || 'Login failed.');
      return;
    }

    // Save credentials for biometric re-auth
    if (result.user.biometricCredentialId) {
      saveBiometricCredentials(result.user.email, password);
    }

    setLastPassword(password);
    login(toStudentProfile(result.user));
    navigate('/welcome');
  };

  const onRegister = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (regPassword !== confirmPassword) {
      setError('Password and Confirm Password must match.');
      return;
    }

    setBusy(true);
    const result = await registerUser({
      name,
      className,
      division,
      rollNo: Number(rollNo),
      email,
      password: regPassword,
    });

    if (!result.ok || !result.user) {
      setBusy(false);
      setError(result.error || 'Registration failed.');
      return;
    }

    setBusy(false);
    setLastPassword(regPassword);
    login(toStudentProfile(result.user));
    navigate('/welcome');
  };

  const onBiometricLogin = (type: 'face' | 'fingerprint') => {
    setError('');
    setSuccess('');
    setBiometricAnim(type);
  };

  const onBiometricAnimComplete = async () => {
    setBiometricAnim(null);
    setBusy(true);
    const result = await loginWithBiometric(emailLogin || undefined);
    setBusy(false);

    if (!result.ok || !result.user) {
      setError(result.error || 'Biometric login failed.');
      return;
    }

    login(toStudentProfile(result.user));
    navigate('/welcome');
  };

  if (biometricAnim) {
    return <BiometricAnimation type={biometricAnim} onComplete={onBiometricAnimComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-fun-purple/10 via-background to-secondary/20 flex flex-col items-center justify-center px-4 sm:px-6">
      <GuideCharacter message={helpMessage} size="sm" />

      <motion.div
        key={mode}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-6 w-full max-w-sm"
      >
        <div className="bg-card rounded-3xl p-5 sm:p-6 shadow-xl border-2 border-primary/20">
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 rounded-xl font-display text-sm ${mode === 'login' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 rounded-xl font-display text-sm ${mode === 'register' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}
            >
              First Time
            </button>
          </div>

          {error && <p className="mb-3 text-xs font-body text-red-600">{error}</p>}
          {success && <p className="mb-3 text-xs font-body text-green-700">{success}</p>}

          {mode === 'login' && (
            <form className="space-y-3" onSubmit={onLoginWithPassword}>
              <input
                value={emailLogin}
                onChange={(e) => setEmailLogin(e.target.value)}
                placeholder="Email"
                type="email"
                className="w-full rounded-xl border px-3 py-2 text-sm"
                required
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                className="w-full rounded-xl border px-3 py-2 text-sm"
                required
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display"
                disabled={busy}
              >
                {busy ? 'Logging in...' : 'Login with Password'}
              </button>

              <div className="pt-2 border-t border-border/60">
                <p className="text-xs text-muted-foreground mb-2">Face/Fingerprint Login</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onBiometricLogin('face')}
                    className="py-3 rounded-xl bg-sky-100 text-sky-700 font-display flex items-center justify-center gap-2 text-sm"
                    disabled={busy || !biometricSupported}
                  >
                    <ScanFace className="w-4 h-4" />
                    Face Login
                  </button>
                  <button
                    type="button"
                    onClick={() => onBiometricLogin('fingerprint')}
                    className="py-3 rounded-xl bg-emerald-100 text-emerald-700 font-display flex items-center justify-center gap-2 text-sm"
                    disabled={busy || !biometricSupported}
                  >
                    <Fingerprint className="w-4 h-4" />
                    Fingerprint
                  </button>
                </div>
                {!biometricSupported && (
                  <p className="mt-2 text-xs text-muted-foreground">Biometric login is not supported on this browser/device.</p>
                )}
              </div>
            </form>
          )}

          {mode === 'register' && (
            <form className="space-y-3" onSubmit={onRegister}>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Student Name" className="w-full rounded-xl border px-3 py-2 text-sm" required />
              <div className="grid grid-cols-3 gap-2">
                <select value={className} onChange={(e) => setClassName(e.target.value)} className="rounded-xl border px-3 py-2 text-sm" required>
                  <option value="">Class</option>
                  <option value="Class 1">Class 1</option>
                  <option value="Class 2">Class 2</option>
                  <option value="Class 3">Class 3</option>
                </select>
                <select value={division} onChange={(e) => setDivision(e.target.value)} className="rounded-xl border px-3 py-2 text-sm" required>
                  <option value="">Division</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                </select>
                <input value={rollNo} onChange={(e) => setRollNo(e.target.value)} type="number" min={1} placeholder="Roll" className="rounded-xl border px-3 py-2 text-sm" required />
              </div>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full rounded-xl border px-3 py-2 text-sm" required />
              <input value={regPassword} onChange={(e) => setRegPassword(e.target.value)} type="password" placeholder="Password" className="w-full rounded-xl border px-3 py-2 text-sm" required />
              <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="Confirm Password" className="w-full rounded-xl border px-3 py-2 text-sm" required />

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display"
                disabled={busy}
              >
                {busy ? 'Setting up...' : 'Create Account'}
              </button>

              <p className="text-xs text-muted-foreground">
                Duplicate account protection is enabled for Email and Class + Division + Roll No.
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
