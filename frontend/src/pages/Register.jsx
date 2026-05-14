import { motion } from 'framer-motion'
import { HandHeart, Star, Zap, GraduationCap, Check } from 'lucide-react'
import RegisterForm from '../components/auth/RegisterForm'

export default function Register() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-primary-50 dark:bg-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-secondary-300/30 blur-3xl"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-accent-300/30 blur-3xl"
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-7xl gap-0 px-4 pt-24 pb-12 sm:px-6 md:pt-28 lg:grid-cols-2 lg:gap-12 lg:px-8">
        {/* Form panel — left on register so the layout feels different from Login */}
        <div className="order-2 flex items-center justify-center lg:order-1">
          <RegisterForm />
        </div>

        {/* Branding panel */}
        <motion.aside
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="order-1 hidden lg:order-2 lg:flex lg:items-center"
        >
          <div className="glass relative w-full overflow-hidden rounded-3xl p-10 shadow-2xl">
            <div className="absolute inset-0 bg-secondary-500/10" />
            <div className="relative space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-secondary-200 bg-secondary-50/80 px-4 py-2 backdrop-blur-sm dark:border-secondary-800 dark:bg-secondary-900/30">
                <Zap className="h-4 w-4 text-secondary-600 dark:text-secondary-400" />
                <span className="text-sm font-semibold text-secondary-700 dark:text-secondary-300">
                  New here? Welcome.
                </span>
              </div>

              <h2 className="font-display text-4xl font-bold leading-tight text-slate-900 dark:text-slate-100">
                Make an account in <span className="gradient-text">two minutes</span>.
              </h2>
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                Once you&apos;re signed up you can RSVP to any Saturday on the calendar. We email a reminder a couple of days before each one.
              </p>

              <ul className="space-y-3 pt-2">
                {[
                  { icon: HandHeart, text: 'Sign up for whichever Saturdays you can make' },
                  { icon: GraduationCap, text: 'Short safety briefing at the start of each event' },
                  { icon: Star, text: 'See the photos and receipts from past events' },
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.12 }}
                    className="flex items-start gap-3 rounded-2xl border border-white/40 bg-white/50 p-4 backdrop-blur-sm dark:border-slate-700/40 dark:bg-slate-800/50"
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-500 text-white">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <span className="pt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                      {item.text}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <div className="flex items-center gap-3 pt-2 text-sm text-slate-600 dark:text-slate-300">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Check className="h-4 w-4" />
                </span>
                Free, of course. You&apos;re volunteering.
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  )
}
