import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'inline-flex items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:bg-primary-700 active:translate-y-0 active:shadow-md disabled:opacity-50 disabled:cursor-not-allowed',
  secondary: 'inline-flex items-center justify-center gap-2 rounded-full bg-secondary-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:shadow-md disabled:opacity-50',
  outline: 'inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary-600 px-6 py-3 font-semibold text-primary-600 transition-all duration-200 hover:bg-primary-50 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50',
  ghost: 'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-100 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800',
  gradient: 'inline-flex items-center justify-center gap-2 rounded-full bg-accent-500 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:shadow-md disabled:opacity-50',
  danger: 'inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:shadow-md disabled:opacity-50',
}

const sizes = {
  xs: 'px-3 py-1.5 text-xs',
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) {
  const baseClass = variants[variant] || variants.primary
  const sizeClass = sizes[size] || sizes.md

  return (
    <motion.button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseClass} ${sizeClass} ${className}`.replace(/\s+/g, ' ')}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </motion.button>
  )
}
