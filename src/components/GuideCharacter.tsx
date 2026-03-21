import { motion } from 'framer-motion';
import pandaGuide from '@/assets/panda-guide.png';

interface Props {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function GuideCharacter({ message, size = 'md' }: Props) {
  const sizeMap = { sm: 'w-16 h-16', md: 'w-24 h-24', lg: 'w-32 h-32' };

  return (
    <div className="flex flex-col items-center gap-2">
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="bg-card rounded-2xl px-3 sm:px-4 py-2 shadow-lg border-2 border-primary/20 max-w-[90vw] sm:max-w-[250px] text-center"
        >
          <p className="text-sm font-body font-medium text-foreground">{message}</p>
        </motion.div>
      )}
      <motion.img
        src={pandaGuide}
        alt="Panda Guide"
        className={`${sizeMap[size]} object-contain drop-shadow-lg`}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
