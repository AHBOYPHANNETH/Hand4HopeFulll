import { motion } from 'framer-motion'
import React from 'react'

export function FadeIn({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  )
}

export function FadeInUp({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  )
}

export function SlideIn({ children, delay = 0, direction = 'left' }) {
  const variants = {
    left: { initial: { opacity: 0, x: -30 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 } },
  }

  return (
    <motion.div
      initial={variants[direction].initial}
      whileInView={variants[direction].animate}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  )
}

export function ScaleIn({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ children, delay = 0 }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

export function HoverScale({ children, scale = 1.05 }) {
  return (
    <motion.div
      whileHover={{ scale }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
      {children}
    </motion.div>
  )
}

export function FloatingElement({ children, delay = 0 }) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

export function CountUp({ end, duration = 2.5 }) {
  const nodeRef = React.useRef(null)

  React.useEffect(() => {
    const controls = {
      value: 0,
    }

    const animate = () => {
      if (!nodeRef.current) return

      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / (duration * 1000), 1)
        controls.value = Math.floor(progress * end)

        nodeRef.current.textContent = controls.value.toLocaleString()

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      animate()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate()
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    if (nodeRef.current) {
      observer.observe(nodeRef.current)
    }

    return () => observer.disconnect()
  }, [end, duration])

  return <span ref={nodeRef}>0</span>
}
