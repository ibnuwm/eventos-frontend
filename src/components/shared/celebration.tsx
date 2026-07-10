"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CelebrationProps {
  trigger: boolean;
  message?: string;
}

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#3b82f6", "#8b5cf6"];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function ConfettiPiece({ delay }: { delay: number }) {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const xEnd = randomBetween(-200, 200);
  const rotationEnd = randomBetween(-360, 360);

  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
      animate={{ x: xEnd, y: 300, opacity: 0, scale: 1, rotate: rotationEnd }}
      transition={{ duration: randomBetween(0.8, 1.5), delay, ease: "easeOut" }}
      className="absolute top-0 left-1/2 w-2 h-2 rounded-sm"
      style={{ backgroundColor: color }}
    />
  );
}

export function Celebration({ trigger, message }: CelebrationProps) {
  const [active, setActive] = useState(false);
  const [pieces] = useState(() => Array.from({ length: 20 }, (_, i) => i));

  useEffect(() => {
    if (trigger) {
      setActive(true);
      const timer = setTimeout(() => setActive(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 z-[70] pointer-events-none flex items-center justify-center"
        >
          {/* Confetti */}
          <div className="absolute inset-0 overflow-hidden">
            {pieces.map((i) => (
              <ConfettiPiece key={i} delay={i * 0.03} />
            ))}
          </div>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="bg-card border border-border/60 rounded-2xl px-6 py-4 shadow-2xl shadow-brand-500/20 text-center pointer-events-auto"
            >
              <div className="text-2xl mb-1">🎉</div>
              <div className="font-bold text-foreground text-sm">{message}</div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
