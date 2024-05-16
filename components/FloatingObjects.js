// components/FloatingObjects.js
import { motion } from 'framer-motion';

const FloatingObjects = () => {
  const objectVariants = {
    float: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="relative z-10">
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-300 rounded-full shadow-lg"
        variants={objectVariants}
        animate="float"
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-40 h-40 bg-red-300 rounded-full shadow-lg"
        variants={objectVariants}
        animate="float"
      />
      <motion.div
        className="absolute top-3/4 left-3/4 w-24 h-24 bg-green-300 rounded-full shadow-lg"
        variants={objectVariants}
        animate="float"
      />
    </div>
  );
};

export default FloatingObjects;
