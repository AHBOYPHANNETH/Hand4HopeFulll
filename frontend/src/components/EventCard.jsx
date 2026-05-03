import { Link } from 'react-router-dom'

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

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link to={`/events/${event.id}`} className="relative aspect-[16/10] block overflow-hidden">
        <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/55 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-teal-800 shadow-sm">
          {formatDate(event.starts_at)}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-semibold text-stone-900">
          <Link to={`/events/${event.id}`} className="hover:text-teal-700">
            {event.title}
          </Link>
        </h3>
        <p className="text-sm text-stone-600 line-clamp-2">{event.description}</p>
        <p className="mt-auto text-sm font-medium text-teal-700">{event.location}</p>
        <Link
          to={`/events/${event.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-900"
        >
          View details →
        </Link>
      </div>
    </article>
  )
}
