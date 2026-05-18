import { motion } from 'framer-motion'
import { Heart, Users, Sparkles, ShieldCheck } from 'lucide-react'
import LoginForm from '../components/auth/LoginForm'

export default function Login() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-primary-50 dark:bg-slate-900">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary-300/30 blur-3xl"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent-300/30 blur-3xl"
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-7xl gap-0 px-4 pt-24 pb-12 sm:px-6 md:pt-28 lg:grid-cols-2 lg:gap-12 lg:px-8">
        {/* Branding panel */}
        <motion.aside
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="hidden lg:flex lg:items-center"
        >
          <div className="glass relative w-full overflow-hidden rounded-3xl p-10 shadow-2xl">
            <div className="absolute inset-0 bg-primary-500/10" />
            <div className="relative space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/80 px-4 py-2 backdrop-blur-sm dark:border-primary-800 dark:bg-primary-900/30">
                <Sparkles className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                  Welcome back
                </span>
              </div>

              <h2 className="font-display text-4xl font-bold leading-tight text-slate-900 dark:text-slate-100">
                Sign in and pick a <span className="gradient-text">volunteer event</span>.
              </h2>
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                Log in to sign up for events, see what you&apos;ve been to, and stay in the loop.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                {[
                  { icon: Users, n: '85',  label: 'Regular volunteers' },
                  { icon: Heart, n: '120', label: 'Kids reached this year' },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.15 }}
                    className="rounded-2xl bg-white/60 p-5 backdrop-blur dark:bg-slate-800/60"
                  >
                    <s.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">{s.n}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {s.label}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/40 bg-white/50 p-4 backdrop-blur-sm dark:border-slate-700/40 dark:bg-slate-800/50">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </span>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  We never share your email and we don&apos;t spam.
                </p>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Form panel */}
        <div className="flex items-center justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
