// components/AnimatedBackground.js
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  const backgroundVariants = {
    animate: {
      rotate: [0, 360],
      scale: [1, 1.5, 1],
      transition: {
        duration: 10,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  };

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500 to-purple-600"
      variants={backgroundVariants}
      animate="animate"
    />
  );
};

export default AnimatedBackground;
