import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, MapPin, ArrowRight, Users } from 'lucide-react'

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

  return (
    <motion.article
      className="card group overflow-hidden"
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
      <Link
        to={`/events/${event.id}`}
        className="relative block aspect-[16/10] overflow-hidden bg-primary-200 dark:bg-primary-900/60"
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
            <Calendar className="h-10 w-10 text-primary-600/60 dark:text-primary-300/60 sm:h-12 sm:w-12" />
          </div>
        )}
        <div className="absolute inset-0 bg-slate-900/60 to-transparent" />

        {/* Badges */}
        <div className="absolute left-2 top-2 flex max-w-[calc(100%-1rem)] flex-wrap gap-1.5 sm:left-4 sm:top-4 sm:gap-2">
          <motion.span
            className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-semibold text-slate-700 shadow-lg backdrop-blur-sm sm:px-3 sm:py-1.5 sm:text-xs"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            {formatDate(event.starts_at)}
          </motion.span>
          {event.is_full && (
            <motion.span
              className="inline-flex items-center gap-1 rounded-full bg-orange-500/90 px-2 py-1 text-[10px] font-bold text-white shadow-lg backdrop-blur-sm sm:px-3 sm:py-1.5 sm:text-xs"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
            >
              <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Full
            </motion.span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4 sm:gap-3 sm:p-6">
        <h3 className="line-clamp-2 text-base font-semibold text-slate-900 dark:text-slate-100 sm:text-lg">
          <Link
            to={`/events/${event.id}`}
            className="transition-colors hover:text-primary-600 dark:hover:text-primary-400"
          >
            {event.title}
          </Link>
        </h3>

        <p className="line-clamp-2 flex-grow text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
          {event.description}
        </p>

        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
          <MapPin className="h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
          <span className="line-clamp-1 font-medium">{event.location}</span>
        </div>

        {event.capacity ? (
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
            <Users className="h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
            <span className="font-medium">
              {event.volunteers_count ?? 0} / {event.capacity} volunteers
            </span>
          </div>
        ) : null}

        <Link
          to={`/events/${event.id}`}
          className="group/btn inline-flex items-center gap-2 pt-1 text-sm font-semibold text-primary-600 transition-all hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 sm:pt-2 sm:text-base"
        >
          View Details
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </motion.article>
  )
}
