import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { loginWithBiometric } from '@/lib/auth';
import BiometricAnimation from '@/components/BiometricAnimation';
import GuideCharacter from '@/components/GuideCharacter';
import { motion } from 'framer-motion';
import { ScanFace, Fingerprint, LogIn } from 'lucide-react';

export default function BiometricGate() {
  const { pendingBiometric, confirmBiometricLogin, logout } = useGame();
  const [animType, setAnimType] = useState<'face' | 'fingerprint' | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!pendingBiometric) return null;

  const onAnimComplete = async () => {
    setAnimType(null);
    setBusy(true);
    setError('');

    const result = await loginWithBiometric(pendingBiometric.email);
    setBusy(false);

    if (result.ok) {
      confirmBiometricLogin();
    } else {
      setError(result.error || 'Verification failed. Try again.');
    }
  };

  if (animType) {
    return <BiometricAnimation type={animType} onComplete={onAnimComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-fun-purple/10 via-background to-secondary/20 flex flex-col items-center justify-center px-4">
      <GuideCharacter message={`Welcome back, ${pendingBiometric.name}! Verify to continue.`} size="sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-6 w-full max-w-sm"
      >
        <div className="bg-card rounded-3xl p-6 shadow-xl border-2 border-primary/20 text-center">
          <motion.span
            className="text-5xl block mb-2"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {pendingBiometric.avatar}
          </motion.span>
          <h2 className="text-xl font-display text-foreground">{pendingBiometric.name}</h2>
          <p className="text-xs text-muted-foreground mt-1">{pendingBiometric.class} • Div {pendingBiometric.division}</p>

          {error && <p className="mt-3 text-xs text-red-600">{error}</p>}

          <div className="mt-5 grid grid-cols-2 gap-3">
            <motion.button
              onClick={() => setAnimType('face')}
              disabled={busy}
              className="py-4 rounded-2xl bg-sky-100 text-sky-700 font-display flex flex-col items-center justify-center gap-2 text-sm shadow-md"
              whileTap={{ scale: 0.95 }}
            >
              <ScanFace className="w-8 h-8" />
              Face
            </motion.button>
            <motion.button
              onClick={() => setAnimType('fingerprint')}
              disabled={busy}
              className="py-4 rounded-2xl bg-emerald-100 text-emerald-700 font-display flex flex-col items-center justify-center gap-2 text-sm shadow-md"
              whileTap={{ scale: 0.95 }}
            >
              <Fingerprint className="w-8 h-8" />
              Fingerprint
            </motion.button>
          </div>

          {busy && <p className="mt-3 text-xs text-muted-foreground animate-pulse">Verifying...</p>}

          <button
            onClick={logout}
            className="mt-5 text-xs text-muted-foreground flex items-center justify-center gap-1 mx-auto"
          >
            <LogIn className="w-3 h-3" />
            Use a different account
          </button>
        </div>
      </motion.div>
    </div>
  );
}
