import { motion } from 'framer-motion';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import GuideCharacter from '@/components/GuideCharacter';
import { Fingerprint, ScanFace } from 'lucide-react';
import {
  getRememberedUser,
  getUsers,
  hasBiometricSupport,
  loginWithBiometric,
  loginWithPassword,
  rememberUser,
  registerBiometric,
  registerUser,
  toStudentProfile,
} from '@/lib/auth';

type AuthMode = 'login' | 'register';

export default function LoginScreen() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showManualLogin, setShowManualLogin] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const users = getUsers();
  const rememberedUser = getRememberedUser();
  const firstTime = users.length === 0;
  const biometricSupported = hasBiometricSupport();
  const quickUnlockAvailable = Boolean(rememberedUser?.biometricCredentialId) && biometricSupported;

  const onLoginWithPassword = (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const result = loginWithPassword(emailLogin, password);
    if (!result.ok || !result.user) {
      setError(result.error || 'Login failed.');
      return;
    }

    rememberUser(result.user.id);
    login(toStudentProfile(result.user));
    navigate('/world');
  };

  const onRegister = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (regPassword !== confirmPassword) {
      setError('Password and Confirm Password must match.');
      return;
    }

    const result = registerUser({
      name,
      className,
      division,
      rollNo: Number(rollNo),
      email,
      password: regPassword,
    });

    if (!result.ok || !result.user) {
      setError(result.error || 'Registration failed.');
      return;
    }

    let finalUser = result.user;
    if (biometricSupported) {
      setBusy(true);
      const biometric = await registerBiometric(result.user);
      setBusy(false);
      if (biometric.ok && biometric.user) {
        finalUser = biometric.user;
        setSuccess('Registration successful. Face/Fingerprint login enabled.');
      } else {
        setSuccess('Registration successful. You can enable Face/Fingerprint later.');
      }
    } else {
      setSuccess('Registration successful. Face/Fingerprint is not supported on this device.');
    }

    rememberUser(finalUser.id);
    login(toStudentProfile(finalUser));
    navigate('/world');
  };

  const onBiometricLogin = async () => {
    setError('');
    setSuccess('');
    setBusy(true);
    const result = await loginWithBiometric(showManualLogin ? emailLogin : '');
    setBusy(false);

    if (!result.ok || !result.user) {
      setError(result.error || 'Biometric login failed.');
      return;
    }

    rememberUser(result.user.id);
    login(toStudentProfile(result.user));
    navigate('/world');
  };

  const helpMessage = firstTime
    ? 'First time here? Please create your profile first. 😊'
    : quickUnlockAvailable && !showManualLogin
      ? `Welcome back, ${rememberedUser?.name}! Use Face/Fingerprint to continue.`
      : 'Login using Email + Password, or Face/Fingerprint.';

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

          {mode === 'login' && quickUnlockAvailable && !showManualLogin && rememberedUser && (
            <div className="space-y-4 text-center">
              <motion.div
                className="rounded-2xl border border-primary/20 bg-primary/5 p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-5xl mb-2">{rememberedUser.avatar}</div>
                <h2 className="font-display text-lg text-foreground">{rememberedUser.name}</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  {rememberedUser.class} • Division {rememberedUser.division} • Roll No. {rememberedUser.rollNo}
                </p>
              </motion.div>

              <button
                type="button"
                onClick={onBiometricLogin}
                className="w-full py-3 rounded-xl bg-secondary text-foreground font-display flex items-center justify-center gap-2"
                disabled={busy}
              >
                <ScanFace className="w-4 h-4" />
                <Fingerprint className="w-4 h-4" />
                {busy ? 'Verifying...' : 'Unlock with Face/Fingerprint'}
              </button>

              <button
                type="button"
                onClick={() => { setShowManualLogin(true); setError(''); setSuccess(''); }}
                className="w-full py-2 rounded-xl bg-muted text-foreground text-sm"
              >
                Use Another Account
              </button>
            </div>
          )}

          {mode === 'login' && (!quickUnlockAvailable || showManualLogin) && (
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
                Login with Password
              </button>

              <div className="pt-2 border-t border-border/60">
                <p className="text-xs text-muted-foreground mb-2">Face/Fingerprint Login</p>
                <button
                  type="button"
                  onClick={onBiometricLogin}
                  className="w-full py-3 rounded-xl bg-secondary text-foreground font-display flex items-center justify-center gap-2"
                  disabled={busy || !biometricSupported}
                >
                  <ScanFace className="w-4 h-4" />
                  <Fingerprint className="w-4 h-4" />
                  {busy ? 'Verifying...' : 'Login with Face/Fingerprint'}
                </button>
                {!biometricSupported && (
                  <p className="mt-2 text-xs text-muted-foreground">Biometric login is not supported on this browser/device.</p>
                )}
              </div>

              {quickUnlockAvailable && (
                <button
                  type="button"
                  onClick={() => { setShowManualLogin(false); setError(''); setSuccess(''); }}
                  className="w-full py-2 rounded-xl bg-muted text-foreground text-sm"
                >
                  Back to Quick Unlock
                </button>
              )}
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
                {busy ? 'Setting up Face/Fingerprint...' : 'Create Account'}
              </button>

              <p className="text-[11px] text-muted-foreground">
                Duplicate account protection is enabled for Email and Class + Division + Roll No.
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
