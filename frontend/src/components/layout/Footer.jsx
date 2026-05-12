import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin } from 'lucide-react'
import logo from '../../assets/picture/hand4hope_logo.png'

const SocialFacebook = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)
const SocialTwitter = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)
const SocialInstagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)
const SocialLinkedin = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const socialLinks = [
  { icon: SocialFacebook, label: 'Facebook', href: '#' },
  { icon: SocialTwitter, label: 'Twitter', href: '#' },
  { icon: SocialInstagram, label: 'Instagram', href: '#' },
  { icon: SocialLinkedin, label: 'LinkedIn', href: '#' },
]

const navLinks = [
  { label: 'Events', href: '/events' },
  { label: 'Donate', href: '/donate' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Volunteer', href: '/register' },
]

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/50 bg-gradient-to-b from-slate-50 to-white dark:border-slate-700/50 dark:from-slate-900 dark:to-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-display font-bold text-xl text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              <img src={logo} alt="Hand4Hope" className="h-7 w-7 object-contain" />
              Hand4Hope
            </Link>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Building inclusive communities where every child thrives. Supporting children with intellectual disabilities through daycare, education, and advocacy.
            </p>
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all hover:bg-primary-600 hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-primary-600 dark:hover:text-white"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }} className="space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Quick Links</h3>
            <ul className="space-y-3">
              {navLinks.slice(0, 3).map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-600 transition-all hover:pl-1 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* More Links */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }} className="space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">More</h3>
            <ul className="space-y-3">
              {navLinks.slice(3).map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-600 transition-all hover:pl-1 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.3 }} className="space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Contact</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600 dark:text-primary-400" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Phnom Penh, Cambodia</span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600 dark:text-primary-400" />
                <a href="mailto:info@hand4hope.org" className="break-all text-sm text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400">
                  info@hand4hope.org
                </a>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600 dark:text-primary-400" />
                <a href="tel:+85523123456" className="text-sm text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400">
                  +855 (0) 86 211 522
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="my-12 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700" />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center justify-between gap-6 md:flex-row"
        >
          <p className="text-sm text-slate-600 dark:text-slate-400">
            © {new Date().getFullYear()} Hand4Hope. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { label: 'Privacy Policy', to: '/privacy' },
              { label: 'Terms of Service', to: '/terms' },
              { label: 'Cookie Policy', to: '/cookies' },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="text-sm text-slate-600 transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
              >
                {label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
