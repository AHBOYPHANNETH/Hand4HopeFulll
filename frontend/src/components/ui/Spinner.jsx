import { motion } from 'framer-motion'

export default function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-primary-50">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Spinner */}
        <div className="relative h-20 w-20">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary-200"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary-600 border-r-secondary-600"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border-2 border-transparent border-b-accent-500"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <motion.p
            className="text-lg font-semibold text-slate-900"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {label}
          </motion.p>
        </div>

        {/* Loading Dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-primary-600"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
