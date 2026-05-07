import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
  ]

  const links = [
    { label: 'Events', href: '/events' },
    { label: 'Donate', href: '/donate' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ]

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <footer className="border-t border-slate-200/50 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <motion.div
            variants={footerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            <Link to="/" className="inline-flex items-center gap-2 font-display font-bold text-xl text-primary-600 hover:text-primary-700">
              🤝 Hand4Hope
            </Link>
            <p className="text-sm leading-relaxed text-slate-600">
              Building inclusive communities where every child thrives. Supporting children with intellectual disabilities through daycare, education, and advocacy.
            </p>
            <div className="flex gap-3 pt-4">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-primary-600 hover:text-white transition-all"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={footerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-slate-900">Quick Links</h3>
            <ul className="space-y-3">
              {links.slice(0, 3).map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-600 hover:text-primary-600 transition-colors hover:pl-1 inline-block"
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* More Links */}
          <motion.div
            variants={footerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-slate-900">More</h3>
            <ul className="space-y-3">
              {links.slice(3).map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-600 hover:text-primary-600 transition-colors hover:pl-1 inline-block"
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/register"
                  className="text-sm text-slate-600 hover:text-primary-600 transition-colors hover:pl-1 inline-block"
                >
                  → Volunteer
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            variants={footerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-slate-900">Contact</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600">Phnom Penh, Cambodia</span>
              </li>
              <li className="flex gap-3">
                <Mail className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:info@hand4hope.org"
                  className="text-sm text-slate-600 hover:text-primary-600 transition-colors break-all"
                >
                  info@hand4hope.org
                </a>
              </li>
              <li className="flex gap-3">
                <Phone className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <a
                  href="tel:+85523123456"
                  className="text-sm text-slate-600 hover:text-primary-600 transition-colors"
                >
                  +855 (0) 23 123 456
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

        {/* Bottom Section */}
        <motion.div
          variants={footerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center justify-between gap-6 md:flex-row"
        >
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} Hand4Hope. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-slate-600 hover:text-primary-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-slate-600 hover:text-primary-600 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-slate-600 hover:text-primary-600 transition-colors">
              Cookie Policy
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
