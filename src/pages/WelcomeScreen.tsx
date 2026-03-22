import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import GuideCharacter from '@/components/GuideCharacter';
import { hasBiometricSupport, registerBiometric, getLastPassword } from '@/lib/auth';
import { ScanFace, Fingerprint } from 'lucide-react';

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const { student } = useGame();
  const [setupDone, setSetupDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);

  if (!student) return null;

  const biometricSupported = hasBiometricSupport();
  const alreadySetup = typeof window !== 'undefined' && localStorage.getItem('lea_biometric_email');

  const handleSetupBiometric = async () => {
    // Get password from memory (set during register/login) or ask user
    let password = getLastPassword();
    if (!password) {
      if (!showPasswordField) {
        setShowPasswordField(true);
        return;
      }
      password = passwordInput;
    }

    if (!password) {
      setMessage('Please enter your password.');
      return;
    }

    setBusy(true);
    setMessage('Setting up...');

    const result = await registerBiometric(
      { ...student, email: student.email || '' },
      password,
    );

    setBusy(false);
    if (result.ok) {
      setSetupDone(true);
      setMessage('Biometric login enabled! ✅');
    } else {
      setMessage(result.error || 'Setup failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/20 via-background to-primary/10 flex flex-col items-center justify-center px-4 sm:px-6">
      <GuideCharacter message={`Welcome, ${student.name}! 🎉`} size="sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 12, delay: 0.2 }}
        className="mt-6 w-full max-w-sm"
      >
        <div className="bg-card rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-primary/20 text-center">
          <motion.span
            className="text-6xl sm:text-7xl block mb-3"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {student.avatar}
          </motion.span>

          <h2 className="text-2xl sm:text-3xl font-display text-foreground">{student.name}</h2>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm font-body text-muted-foreground">
              <span>📚</span>
              <span>Class: {student.class}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm font-body text-muted-foreground">
              <span>🏠</span>
              <span>Division: {student.division}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm font-body text-muted-foreground">
              <span>🔢</span>
              <span>Roll No: {student.rollNo}</span>
            </div>
          </div>

          {message && (
            <p className={`mt-3 text-xs font-body ${message.includes('✅') || message.includes('enabled') ? 'text-green-600' : message.includes('Setting') ? 'text-muted-foreground' : 'text-red-600'}`}>
              {message}
            </p>
          )}

          {/* Biometric setup — only if not already set up */}
          {biometricSupported && !alreadySetup && !setupDone && (
            <div className="mt-5 p-3 rounded-2xl bg-sky-50 border border-sky-200">
              <p className="text-xs font-body text-sky-800 mb-3">Set up Face/Fingerprint for quick login?</p>

              {showPasswordField && (
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full mb-3 rounded-xl border px-3 py-2 text-sm"
                />
              )}

              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  onClick={handleSetupBiometric}
                  disabled={busy}
                  className="py-2.5 rounded-xl bg-sky-100 text-sky-700 font-display text-xs flex items-center justify-center gap-1.5"
                  whileTap={{ scale: 0.95 }}
                >
                  <ScanFace className="w-4 h-4" />
                  {busy ? '...' : 'Face'}
                </motion.button>
                <motion.button
                  onClick={handleSetupBiometric}
                  disabled={busy}
                  className="py-2.5 rounded-xl bg-emerald-100 text-emerald-700 font-display text-xs flex items-center justify-center gap-1.5"
                  whileTap={{ scale: 0.95 }}
                >
                  <Fingerprint className="w-4 h-4" />
                  {busy ? '...' : 'Fingerprint'}
                </motion.button>
              </div>
              <button
                onClick={() => setSetupDone(true)}
                className="mt-2 text-[10px] text-muted-foreground"
              >
                Skip for now
              </button>
            </div>
          )}

          <motion.button
            onClick={() => navigate('/world')}
            className="mt-5 w-full py-4 rounded-2xl bg-primary text-primary-foreground font-display text-lg shadow-lg"
            whileTap={{ scale: 0.97 }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ scale: { duration: 1.5, repeat: Infinity } }}
          >
            Let's Go! 🚀
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
