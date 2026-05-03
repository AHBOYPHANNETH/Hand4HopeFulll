import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-stone-100 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold text-teal-800">Hand4Hope</p>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            Hands of Hope Community supports children with intellectual disabilities across Cambodia through daycare,
            inclusive education, and rights protection.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-900">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-stone-600">
            <li>
              <Link to="/events" className="hover:text-teal-700">
                Events
              </Link>
            </li>
            <li>
              <Link to="/impact" className="hover:text-teal-700">
                Impact
              </Link>
            </li>
            <li>
              <Link to="/donate" className="hover:text-teal-700">
                Donate
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-teal-700">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-900">Volunteer</p>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            Create an account or sign in with Google to join upcoming programs and receive orientation updates.
          </p>
          <Link to="/register" className="mt-4 inline-flex text-sm font-semibold text-teal-700 hover:text-teal-900">
            Get started →
          </Link>
        </div>
      </div>
      <div className="border-t border-stone-100 bg-stone-50 py-4 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} Hand4Hope · Cambodia
      </div>
    </footer>
  )
}
