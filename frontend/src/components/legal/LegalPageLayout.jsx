import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'

export default function LegalPageLayout({
  eyebrow,
  title,
  effectiveDate,
  intro,
  icon: Icon,
  children,
}) {
  return (
    <div className="relative overflow-hidden bg-linear-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-linear-to-r from-primary-300/30 to-secondary-300/30 blur-3xl"
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-linear-to-r from-accent-300/30 to-primary-300/30 blur-3xl"
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 space-y-5 text-center"
        >
          {Icon ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
              className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary-500 to-secondary-500 shadow-lg"
            >
              <Icon className="h-8 w-8 text-white" />
            </motion.div>
          ) : null}

          {eyebrow ? (
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {eyebrow}
            </p>
          ) : null}

          <h1 className="font-display text-4xl font-bold leading-tight text-slate-900 dark:text-slate-100 md:text-5xl">
            {title}
          </h1>

          {effectiveDate ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 backdrop-blur dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
              <Calendar className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              Effective {effectiveDate}
            </div>
          ) : null}

          {intro ? (
            <p className="mx-auto max-w-2xl pt-2 text-base leading-relaxed text-slate-600 dark:text-slate-300 md:text-lg">
              {intro}
            </p>
          ) : null}
        </motion.header>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-2xl backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/80 sm:p-10 md:p-12"
        >
          {children}
        </motion.article>
      </div>
    </div>
  )
}

export function LegalSection({ icon: Icon, title, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="border-b border-slate-100 py-8 first:pt-0 last:border-b-0 last:pb-0 dark:border-slate-800"
    >
      <div className="mb-4 flex items-center gap-3">
        {Icon ? (
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
        <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-slate-100 md:text-2xl">
          {title}
        </h2>
      </div>
      <div className="legal-prose space-y-3 text-[0.95rem] leading-relaxed text-slate-600 dark:text-slate-300">
        {children}
      </div>
    </motion.section>
  )
}
