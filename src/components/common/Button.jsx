export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'w-full rounded-xl px-4 py-3 font-medium transition disabled:cursor-not-allowed disabled:hover:brightness-100'
  const variants = {
    primary: 'bg-gerayo-from text-black hover:brightness-110 disabled:bg-gerayo-from/50 disabled:text-black/50',
    secondary: 'bg-gerayo-card text-gerayo-text border border-gerayo-border hover:bg-gerayo-border',
    outline: 'bg-transparent border border-red-500 text-red-400 hover:bg-red-500/10',
    ghost: 'bg-transparent text-gerayo-muted hover:text-white',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
