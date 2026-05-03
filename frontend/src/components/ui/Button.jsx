export default function Button({
  children,
  variant = 'primary',
  className = '',
  disabled,
  type = 'button',
  ...props
}) {
  const styles = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm',
    outline: 'border border-teal-600 text-teal-700 hover:bg-teal-50',
    ghost: 'text-teal-700 hover:bg-teal-50',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${styles[variant] ?? styles.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
