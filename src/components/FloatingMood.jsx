import React, { useMemo } from "react";
import { motion } from "framer-motion";

const predefinedMoods = [
  "Happy", "Relaxed", "Energetic", "Calm", "Focused",
  "Excited", "Motivated", "Adventurous", "Romantic",
  "Playful", "Curious", "Creative", "Reflective", "Grateful",
  "Inspired", "Confident", "Peaceful", "Optimistic", "Bored",
  "Tired", "Stressed", "Lonely", "Anxious", "Overwhelmed", "Sad"
];

function randomSign() {
  return Math.random() < 0.5 ? -1 : 1;
}

export default function FloatingMoods({ onMoodSelect }) {
  const moodsWithProps = useMemo(() => 
    predefinedMoods.map(mood => ({
      mood,
      top: Math.random() * 75 + 5,       
      left: Math.random() * 90 + 5,         
      duration: 3 + Math.random() * 7,       
      delay: Math.random() * 4,                 
      xMove: (5 + Math.random() * 20) * randomSign(), 
      yMove: (5 + Math.random() * 25) * randomSign(),  
      rotate: (Math.random() * 15) * randomSign(),    
    })), []
  );

  return (
    <div className="relative w-full h-64 rounded-lg overflow-hidden">
      {moodsWithProps.map(({ mood, top, left, duration, delay, xMove, yMove, rotate }) => (
        <motion.button
          key={mood}
          onClick={() => onMoodSelect && onMoodSelect(mood)}
          className="absolute py-2 px-3 rounded-lg text-sm text-gray-200 bg-[#0B0B2B]/60 border border-[#4A4CFF]/30 cursor-pointer select-none shadow-md"
          style={{ top: `${top}%`, left: `${left}%` }}
          animate={{
            y: [0, yMove, 0],
            x: [0, xMove, 0],
            rotate: [0, rotate, 0],
          }}
          transition={{
            duration,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
            
          }}
          whileHover={{
            scale: 1.2,
            backgroundColor: "rgba(74, 76, 255, 0.7)",
            boxShadow: "0 0 20px rgba(74,76,255,0.6)",
          }}
          whileTap={{ scale: 0.9 }}
        >
          {mood}
        </motion.button>
      ))}
    </div>
  );
}
