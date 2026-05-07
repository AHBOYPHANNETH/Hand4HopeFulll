import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'

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
  const img =
    event.image_url ||
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773f?auto=format&fit=crop&w=900&q=70'
  
  const isFree = !event.price || event.price === 0

  return (
    <motion.article
      className="card overflow-hidden group"
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
      <Link to={`/events/${event.id}`} className="relative aspect-[16/10] block overflow-hidden bg-slate-200">
        <motion.img
          src={img}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <motion.span
            className="inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(event.starts_at)}
          </motion.span>
          <motion.span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold shadow-lg backdrop-blur-sm ${
              isFree 
                ? 'bg-emerald-500/90 text-white' 
                : 'bg-blue-500/90 text-white'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            {isFree ? '✓ Free' : `$${parseFloat(event.price).toFixed(2)}`}
          </motion.span>
        </div>
      </Link>
      
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">
          <Link to={`/events/${event.id}`} className="group/link hover:text-primary-600 transition-colors">
            {event.title}
          </Link>
        </h3>
        
        <p className="text-sm text-slate-600 line-clamp-2 flex-grow">
          {event.description}
        </p>
        
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <MapPin className="h-4 w-4 text-primary-600" />
          <span className="font-medium">{event.location}</span>
        </div>
        
        <Link
          to={`/events/${event.id}`}
          className="inline-flex items-center gap-2 pt-2 font-semibold text-primary-600 hover:text-primary-700 transition-all group/btn"
        >
          View Details
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </motion.article>
  )
}
