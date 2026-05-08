import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, MapPin, ArrowRight, Check, Users } from 'lucide-react'

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export default function EventCard({ event }) {
  const img = event.image_url || null
  const isFree = !event.price || event.price === 0

  return (
    <motion.article
      className="card group overflow-hidden"
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
      <Link
        to={`/events/${event.id}`}
        className="relative block aspect-[16/10] overflow-hidden bg-linear-to-br from-primary-200 via-primary-100 to-secondary-200 dark:from-primary-900/60 dark:via-slate-800 dark:to-secondary-900/60"
      >
        {img ? (
          <motion.img
            src={img}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Calendar className="h-12 w-12 text-primary-600/60 dark:text-primary-300/60" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute left-4 top-4 flex gap-2">
          <motion.span
            className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur-sm"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(event.starts_at)}
          </motion.span>
          <motion.span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold shadow-lg backdrop-blur-sm ${
              isFree ? 'bg-emerald-500/90 text-white' : 'bg-blue-500/90 text-white'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            {isFree ? <><Check className="h-3.5 w-3.5" /> Free</> : `$${parseFloat(event.price).toFixed(2)}`}
          </motion.span>
          {event.is_full && (
            <motion.span
              className="inline-flex items-center gap-1 rounded-full bg-rose-500/90 px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-sm"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
            >
              <Users className="h-3.5 w-3.5" /> Full
            </motion.span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="line-clamp-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
          <Link
            to={`/events/${event.id}`}
            className="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
          >
            {event.title}
          </Link>
        </h3>

        <p className="line-clamp-2 flex-grow text-sm text-slate-600 dark:text-slate-400">
          {event.description}
        </p>

        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <MapPin className="h-4 w-4 text-primary-600 dark:text-primary-400" />
          <span className="font-medium">{event.location}</span>
        </div>

        {event.capacity ? (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Users className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            <span className="font-medium">
              {event.volunteers_count ?? 0} / {event.capacity} volunteers
            </span>
          </div>
        ) : null}

        <Link
          to={`/events/${event.id}`}
          className="group/btn inline-flex items-center gap-2 pt-2 font-semibold text-primary-600 transition-all hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          View Details
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </motion.article>
  )
}
