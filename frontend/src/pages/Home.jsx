import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, ArrowRight, Zap, Users, Heart, TrendingUp } from 'lucide-react'
import EventCard from '../components/EventCard'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import { FadeInUp, FadeIn, ScaleIn, StaggerContainer, StaggerItem, FloatingElement, CountUp } from '../components/animations/AnimatedElements'
import { fetchEvents } from '../services/eventService'
import { fetchPublicContents } from '../services/contentService'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
}

export default function Home() {
  const [contents, setContents] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [c, ev] = await Promise.all([
          fetchPublicContents(),
          fetchEvents({ upcoming: true }),
        ])
        if (!cancelled) {
          setContents(c)
          setEvents(ev.slice(0, 3))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const heroTitle = contents?.hero_title || 'Hands of Hope for Every Child'
  const heroSubtitle =
    contents?.hero_subtitle ||
    'Supporting children with intellectual disabilities through daycare, education, and advocacy in Cambodia.'
  const mission = contents?.mission_text || ''

  const preview = useMemo(() => events || [], [events])

  if (loading) return <Spinner />

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-20 md:pt-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-r from-primary-300/30 to-secondary-300/30 blur-3xl"
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-r from-accent-300/30 to-primary-300/30 blur-3xl"
            animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="inline-flex">
                <div className="flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/80 px-4 py-2 backdrop-blur-sm">
                  <Zap className="h-4 w-4 text-primary-600" />
                  <span className="text-sm font-semibold text-primary-700">Empowering Communities</span>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-4">
                <h1 className="text-5xl font-display font-bold leading-tight tracking-tight text-slate-900 md:text-6xl">
                  {heroTitle.split(' ').map((word, i) => (
                    <span key={i}>
                      {i % 2 === 1 ? (
                        <span className="gradient-text">{word} </span>
                      ) : (
                        <span>{word} </span>
                      )}
                    </span>
                  ))}
                </h1>
                <p className="max-w-xl text-lg leading-relaxed text-slate-600 md:text-xl">
                  {heroSubtitle}
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <Link to="/events">
                  <Button size="lg" className="group">
                    Explore Events
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="lg">
                    Become a Volunteer
                  </Button>
                </Link>
              </motion.div>

              {/* Trust Badges */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-primary-400 to-secondary-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">+1,200 Volunteers</span>
                </div>
                <div className="text-sm font-semibold text-slate-700">⭐ 4.9/5 Rating</div>
              </motion.div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-96 md:h-full"
            >
              <div className="glass relative h-full rounded-3xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <p className="text-sm font-semibold uppercase tracking-wider text-primary-600">Mission Snapshot</p>
                  <p className="text-xl leading-relaxed text-slate-800 font-display">{mission}</p>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="rounded-xl bg-white/50 p-4 backdrop-blur">
                      <p className="text-3xl font-bold text-primary-600">500+</p>
                      <p className="text-xs font-semibold text-slate-600 mt-1">Children Supported</p>
                    </div>
                    <div className="rounded-xl bg-white/50 p-4 backdrop-blur">
                      <p className="text-3xl font-bold text-secondary-600">1.2K</p>
                      <p className="text-xs font-semibold text-slate-600 mt-1">Active Volunteers</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="border-t border-slate-200/50 bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <FadeInUp>
              <h2 className="text-4xl font-display font-bold text-slate-900 md:text-5xl">
                Impact by the Numbers
              </h2>
            </FadeInUp>
          </div>
          <StaggerContainer>
            <div className="grid gap-8 md:grid-cols-4">
              {[
                { icon: Users, number: 500, label: 'Children Supported', suffix: '+' },
                { icon: Heart, number: 1200, label: 'Active Volunteers', suffix: '+' },
                { icon: TrendingUp, number: 85000, label: 'Donations Raised', prefix: '$', suffix: '+' },
                { icon: Zap, number: 50, label: 'Events Hosted', suffix: '+' },
              ].map((stat, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    className="group card p-8 text-center"
                    whileHover={{ y: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <motion.div
                      className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 group-hover:from-primary-200 group-hover:to-primary-300 transition-all"
                      whileHover={{ scale: 1.1 }}
                    >
                      <stat.icon className="h-8 w-8 text-primary-600" />
                    </motion.div>
                    <div className="text-4xl font-bold text-slate-900">
                      {stat.prefix}
                      <CountUp end={stat.number} />
                      {stat.suffix}
                    </div>
                    <p className="mt-3 font-semibold text-slate-700">{stat.label}</p>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div>
                <h2 className="text-4xl font-display font-bold text-slate-900 md:text-5xl">
                  Featured Events
                </h2>
                <p className="mt-4 max-w-2xl text-lg text-slate-600">
                  Join meaningful gatherings and connect with our community
                </p>
              </div>
              <Link to="/events" className="inline-flex items-center gap-2 font-semibold text-primary-600 hover:text-primary-700 transition-colors group">
                View all events
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </FadeInUp>
          <StaggerContainer>
            <div className="grid gap-8 md:grid-cols-3">
              {preview.length === 0 ? (
                <StaggerItem>
                  <p className="text-lg text-slate-600 md:col-span-3 text-center py-12">
                    New events are being scheduled — check back soon!
                  </p>
                </StaggerItem>
              ) : (
                preview.map((ev) => (
                  <StaggerItem key={ev.id}>
                    <EventCard event={ev} />
                  </StaggerItem>
                ))
              )}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Creating a Community Section */}
      <section className="border-y border-slate-200/50 bg-gradient-to-r from-primary-50/50 via-white to-secondary-50/50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <FadeInUp>
              <div className="space-y-6">
                <h2 className="text-4xl font-display font-bold text-slate-900 md:text-5xl">
                  Creating a Community of Volunteers
                </h2>
                <p className="text-lg leading-relaxed text-slate-600">
                  Together, we're building an inclusive community where every person has the opportunity to contribute, learn, and make a meaningful impact in the lives of children with intellectual disabilities.
                </p>
                <StaggerContainer delay={0.2}>
                  {[
                    { icon: '✓', title: 'Flexible Volunteering', desc: 'Choose roles that fit your schedule' },
                    { icon: '✓', title: 'Free Training', desc: 'Comprehensive safeguarding & skills training' },
                    { icon: '✓', title: 'Supportive Team', desc: 'Work alongside passionate community members' },
                    { icon: '✓', title: 'Make an Impact', desc: 'See the real difference you\'re making' },
                  ].map((item, i) => (
                    <StaggerItem key={i}>
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-sm font-bold text-white">
                            {item.icon}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{item.title}</h3>
                          <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
                <Link to="/register">
                  <Button size="lg" className="mt-4">
                    Join Our Community
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </FadeInUp>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="glass relative h-96 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10" />
                <div className="relative h-full flex flex-col justify-center p-8 space-y-4">
                  {[
                    { emoji: '👥', title: 'Community Events', desc: 'Monthly meetups and training' },
                    { emoji: '🎓', title: 'Skills Development', desc: 'Learn while helping others' },
                    { emoji: '🌟', title: 'Recognition', desc: 'Celebrate your contributions' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="rounded-2xl bg-white/60 p-4 backdrop-blur-sm border border-white/40"
                      whileHover={{ x: 10 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{item.emoji}</span>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{item.title}</p>
                          <p className="text-xs text-slate-600">{item.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-display font-bold text-slate-900 md:text-5xl">
                Support Our Mission
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
                Your donation directly supports programs, training, and care for children with intellectual disabilities.
              </p>
            </div>
          </FadeInUp>
          <StaggerContainer>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { price: 25, title: 'Supplies Pack', desc: 'Educational materials for one month', icon: '📚' },
                { price: 100, title: 'Program Support', desc: 'Weekly enrichment activities', icon: '🎯', popular: true },
                { price: 500, title: 'Sponsor', desc: 'Comprehensive support for a child', icon: '❤️' },
              ].map((plan, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    className={`card relative overflow-hidden p-8 transition-all ${plan.popular ? 'md:scale-105 ring-2 ring-gradient-to-r ring-primary-500' : ''}`}
                    whileHover={{ y: -10 }}
                  >
                    {plan.popular && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                        <span className="inline-block bg-gradient-to-r from-accent-500 to-primary-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <div className="text-5xl mb-4">{plan.icon}</div>
                    <div className="text-4xl font-bold text-slate-900">${plan.price}</div>
                    <p className="mt-2 font-semibold text-slate-900">{plan.title}</p>
                    <p className="mt-2 text-sm text-slate-600">{plan.desc}</p>
                    <Link to="/donate" className="mt-6 block">
                      <Button
                        className="w-full"
                        variant={plan.popular ? 'gradient' : 'primary'}
                      >
                        Donate Now
                      </Button>
                    </Link>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* How to Get Started */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-display font-bold text-slate-900 md:text-5xl">
                How to Get Started
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
                Join Hand4Hope in just a few simple steps
              </p>
            </div>
          </FadeInUp>
          <StaggerContainer>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { step: 1, title: 'Create Your Profile', desc: 'Sign up and tell us about yourself', link: '/register', linkText: 'Register now' },
                { step: 2, title: 'Complete Training', desc: 'Participate in our comprehensive training', link: '/events', linkText: 'View training' },
                { step: 3, title: 'Start Making Impact', desc: 'Join events and volunteer at programs', link: '/events', linkText: 'Find events' },
              ].map((item, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    className="card relative p-8 text-center"
                    whileHover={{ y: -8 }}
                  >
                    <motion.div
                      className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 text-2xl font-bold text-white font-display"
                      whileHover={{ scale: 1.1 }}
                    >
                      {item.step}
                    </motion.div>
                    <h3 className="font-display font-semibold text-slate-900 text-lg">{item.title}</h3>
                    <p className="mt-3 text-sm text-slate-600">{item.desc}</p>
                    <Link to={item.link} className="mt-6 inline-flex items-center gap-2 font-semibold text-primary-600 hover:text-primary-700 transition-colors group">
                      {item.linkText}
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-display font-bold text-slate-900 md:text-5xl">
                Voices from Our Community
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Hear from volunteers and donors who are making a difference
              </p>
            </div>
          </FadeInUp>
          <StaggerContainer>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { name: 'Sarah Johnson', role: 'Teacher & Volunteer', quote: 'Volunteering with Hand4Hope has been the most rewarding experience of my life.' },
                { name: 'Mark Chen', role: 'New Volunteer', quote: 'The training provided is excellent. I felt well-prepared from day one.' },
                { name: 'Emily Brown', role: 'Donor', quote: 'Impressed by how transparent they are with funds and their impact.' },
              ].map((testimonial, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    className="card p-8"
                    whileHover={{ y: -5 }}
                  >
                    <div className="mb-4 flex gap-1 text-accent-400">
                      {[...Array(5)].map((_, j) => (
                        <span key={j}>⭐</span>
                      ))}
                    </div>
                    <p className="mb-6 text-lg italic text-slate-700">"{testimonial.quote}"</p>
                    <p className="font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-slate-200/50 bg-gradient-to-br from-slate-50 to-slate-100 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-display font-bold text-slate-900 md:text-5xl">
                Frequently Asked Questions
              </h2>
            </div>
          </FadeInUp>
          <StaggerContainer>
            <div className="space-y-4">
              {[
                { q: 'Do I need prior experience to volunteer?', a: 'No! We welcome volunteers of all backgrounds. We provide comprehensive training for all roles.' },
                { q: 'How much time do I need to commit?', a: 'We offer flexible volunteering. You can start with a few hours a month and increase as you\'re able.' },
                { q: 'Is there an age requirement?', a: 'We welcome volunteers 16 and older. Those under 18 need parental consent.' },
                { q: 'Are donations tax-deductible?', a: 'Yes! Hand4Hope is a registered non-profit. All donations are tax-deductible.' },
                { q: 'Can I donate if I can\'t volunteer?', a: 'Absolutely! Donations are just as valuable and help us continue our mission.' },
              ].map((faq, i) => (
                <StaggerItem key={i}>
                  <details className="group card p-6 cursor-pointer">
                    <summary className="flex items-center justify-between font-semibold text-slate-900 list-none">
                      <span className="flex items-center gap-3">
                        <span className="text-primary-600 font-bold">?</span>
                        {faq.q}
                      </span>
                      <motion.span
                        className="text-primary-600"
                        animate={{ rotate: ['0deg', '180deg'] }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </motion.span>
                    </summary>
                    <p className="mt-4 text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                  </details>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="border-t border-slate-200/50 bg-gradient-to-r from-primary-600 to-secondary-600 py-16 md:py-24 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <FadeInUp>
            <h2 className="text-4xl font-display font-bold text-white md:text-5xl">
              Ready to Make a Difference?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-white/90">
              Join our community of volunteers and donors changing lives
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-slate-50">
                  Volunteer Now
                </Button>
              </Link>
              <Link to="/donate">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Make a Donation
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>
    </div>
  )
}
        <div className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_white,_transparent_55%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 md:flex-row md:items-center md:py-24">
          <div className="flex-1 space-y-6">
            <p className="inline-flex rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-wide">
              Hands of Hope Community
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">{heroTitle}</h1>
            <p className="max-w-xl text-lg text-teal-50">{heroSubtitle}</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/events">
                <Button className="border-white text-white hover:bg-white/50">Explore events</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Become a volunteer
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 rounded-3xl bg-white/10 p-6 shadow-inner backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-100">Mission snapshot</p>
            <p className="mt-3 text-lg leading-relaxed text-white">{mission}</p>
          </div>
        </div>
      </section>
      
      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-semibold text-stone-900">Upcoming gatherings</h2>
            <p className="mt-2 max-w-xl text-stone-600">
              Join orientation sessions, inclusive play days, and family advocacy clinics across Phnom Penh.
            </p>
          </div>
          <Link to="/events" className="text-sm font-semibold text-teal-700 hover:text-teal-900">
            View all events →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {preview.length === 0 ? (
            <p className="text-sm text-stone-600 md:col-span-3">
              New events are being scheduled — check back soon or contact our team.
            </p>
          ) : (
            preview.map((ev) => <EventCard key={ev.id} event={ev} />)
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="border-y border-teal-100 bg-teal-50/70">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h2 className="text-3xl font-semibold text-stone-900">Impact by the numbers</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            <div className="rounded-xl bg-white p-6 shadow-sm border border-teal-100">
              <p className="text-4xl font-bold text-teal-600">500+</p>
              <p className="mt-2 text-sm font-semibold text-stone-700">Children Supported</p>
              <p className="mt-1 text-xs text-stone-600">In our programs</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm border border-teal-100">
              <p className="text-4xl font-bold text-teal-600">1,200+</p>
              <p className="mt-2 text-sm font-semibold text-stone-700">Active Volunteers</p>
              <p className="mt-1 text-xs text-stone-600">Making a difference</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm border border-teal-100">
              <p className="text-4xl font-bold text-teal-600">$85K+</p>
              <p className="mt-2 text-sm font-semibold text-stone-700">Donations Raised</p>
              <p className="mt-1 text-xs text-stone-600">This year</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm border border-teal-100">
              <p className="text-4xl font-bold text-teal-600">50+</p>
              <p className="mt-2 text-sm font-semibold text-stone-700">Events Hosted</p>
              <p className="mt-1 text-xs text-stone-600">Community gatherings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Creating a Community Section */}
      <section className="bg-gradient-to-r from-teal-50 to-amber-50">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-semibold text-stone-900">Creating a Community of Volunteers</h2>
              <p className="mt-4 text-stone-600">
                Together, we're building an inclusive community where every person has the opportunity to contribute, 
                learn, and make a meaningful impact in the lives of children with intellectual disabilities.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold mt-1">✓</span>
                  <span className="text-stone-700"><strong>Flexible volunteering</strong> - Choose roles that fit your schedule</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold mt-1">✓</span>
                  <span className="text-stone-700"><strong>Free training</strong> - Comprehensive safeguarding & skills training</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold mt-1">✓</span>
                  <span className="text-stone-700"><strong>Supportive team</strong> - Work alongside passionate community members</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-600 font-bold mt-1">✓</span>
                  <span className="text-stone-700"><strong>Make an impact</strong> - See the real difference you're making</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link to="/register">
                  <Button>Join Our Community</Button>
                </Link>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-teal-200 to-teal-300 p-8 shadow-lg">
              <div className="space-y-4">
                <div className="rounded-lg bg-white/80 p-4">
                  <p className="text-sm font-semibold text-teal-900">👥 Community Events</p>
                  <p className="mt-1 text-xs text-teal-800">Monthly meetups and training sessions</p>
                </div>
                <div className="rounded-lg bg-white/80 p-4">
                  <p className="text-sm font-semibold text-teal-900">🎓 Skills Development</p>
                  <p className="mt-1 text-xs text-teal-800">Learn new skills while helping others</p>
                </div>
                <div className="rounded-lg bg-white/80 p-4">
                  <p className="text-sm font-semibold text-teal-900">🌟 Recognition</p>
                  <p className="mt-1 text-xs text-teal-800">Celebrate your contributions with us</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-stone-900">Support Our Mission</h2>
          <p className="mt-2 max-w-2xl mx-auto text-stone-600">
            Your donation directly supports programs, training, and care for children with intellectual disabilities.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white p-8 text-center hover:shadow-lg transition">
            <p className="text-4xl font-bold text-teal-600">$25</p>
            <p className="mt-2 font-semibold text-stone-900">Supplies Pack</p>
            <p className="mt-2 text-sm text-stone-600">Provides educational materials for one month</p>
            <Link to="/donate" className="mt-6 block">
              <Button className="w-full">Donate</Button>
            </Link>
          </div>
          <div className="rounded-xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-white p-8 text-center hover:shadow-lg transition transform md:scale-105">
            <p className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-3">Most Popular</p>
            <p className="text-4xl font-bold text-amber-600">$100</p>
            <p className="mt-2 font-semibold text-stone-900">Program Support</p>
            <p className="mt-2 text-sm text-stone-600">Funds weekly enrichment activities</p>
            <Link to="/donate" className="mt-6 block">
              <Button className="w-full bg-amber-600 hover:bg-amber-700">Donate</Button>
            </Link>
          </div>
          <div className="rounded-xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white p-8 text-center hover:shadow-lg transition">
            <p className="text-4xl font-bold text-teal-600">$500</p>
            <p className="mt-2 font-semibold text-stone-900">Sponsor</p>
            <p className="mt-2 text-sm text-stone-600">Provides comprehensive support for a child</p>
            <Link to="/donate" className="mt-6 block">
              <Button className="w-full">Donate</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How to Get Started Section */}
      <section className="bg-stone-50">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h2 className="text-3xl font-semibold text-stone-900 text-center">How to Get Started</h2>
          <p className="mt-2 max-w-2xl mx-auto text-center text-stone-600 mb-12">
            Join Hand4Hope in just a few simple steps
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-white font-bold text-lg">1</div>
              <h3 className="mt-4 font-semibold text-stone-900">Create Your Profile</h3>
              <p className="mt-2 text-sm text-stone-600">
                Sign up and tell us about yourself, your skills, and how you'd like to help.
              </p>
              <Link to="/register" className="mt-3 text-teal-600 text-sm font-semibold hover:text-teal-800">Register now →</Link>
            </div>
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-white font-bold text-lg">2</div>
              <h3 className="mt-4 font-semibold text-stone-900">Complete Training</h3>
              <p className="mt-2 text-sm text-stone-600">
                Participate in our comprehensive safeguarding and role-specific training programs.
              </p>
              <Link to="/events" className="mt-3 text-teal-600 text-sm font-semibold hover:text-teal-800">View training events →</Link>
            </div>
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-white font-bold text-lg">3</div>
              <h3 className="mt-4 font-semibold text-stone-900">Start Making Impact</h3>
              <p className="mt-2 text-sm text-stone-600">
                Join events, volunteer at programs, and see the difference you're making daily.
              </p>
              <Link to="/events" className="mt-3 text-teal-600 text-sm font-semibold hover:text-teal-800">Find events →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback/Testimonials Section */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <h2 className="text-3xl font-semibold text-stone-900 text-center">Voices from Our Community</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex gap-1 text-amber-400">
              <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
            </div>
            <p className="mt-4 text-stone-700 italic">
              "Volunteering with Hand4Hope has been the most rewarding experience of my life. The kids are amazing!"
            </p>
            <p className="mt-4 font-semibold text-stone-900">Sarah Johnson</p>
            <p className="text-sm text-stone-600">Teacher & Volunteer</p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex gap-1 text-amber-400">
              <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
            </div>
            <p className="mt-4 text-stone-700 italic">
              "The training provided is excellent. I felt well-prepared and supported from day one."
            </p>
            <p className="mt-4 font-semibold text-stone-900">Mark Chen</p>
            <p className="text-sm text-stone-600">New Volunteer</p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex gap-1 text-amber-400">
              <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
            </div>
            <p className="mt-4 text-stone-700 italic">
              "I donated to support their mission, and I'm impressed by how transparent they are with funds."
            </p>
            <p className="mt-4 font-semibold text-stone-900">Emily Brown</p>
            <p className="text-sm text-stone-600">Donor</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gradient-to-br from-stone-50 to-teal-50">
        <div className="mx-auto max-w-4xl px-4 py-14 md:py-20">
          <h2 className="text-3xl font-semibold text-stone-900 text-center">Frequently Asked Questions</h2>
          <div className="mt-10 space-y-4">
            <details className="group rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-stone-900">
                Do I need prior experience to volunteer?
                <span className="text-teal-600">+</span>
              </summary>
              <p className="mt-4 text-sm text-stone-600">
                No! We welcome volunteers of all backgrounds. We provide comprehensive training for all roles, regardless of your prior experience.
              </p>
            </details>
            <details className="group rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-stone-900">
                How much time do I need to commit?
                <span className="text-teal-600">+</span>
              </summary>
              <p className="mt-4 text-sm text-stone-600">
                We offer flexible volunteering options. You can start with just a few hours a month and increase as you're able.
              </p>
            </details>
            <details className="group rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-stone-900">
                Is there an age requirement to volunteer?
                <span className="text-teal-600">+</span>
              </summary>
              <p className="mt-4 text-sm text-stone-600">
                We welcome volunteers 16 and older. Those under 18 will need parental consent and may participate in age-appropriate roles.
              </p>
            </details>
            <details className="group rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-stone-900">
                Are donations tax-deductible?
                <span className="text-teal-600">+</span>
              </summary>
              <p className="mt-4 text-sm text-stone-600">
                Yes! Hand4Hope is a registered non-profit organization. All donations are tax-deductible. We'll provide a receipt for your records.
              </p>
            </details>
            <details className="group rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-stone-900">
                What if I want to donate but can't volunteer?
                <span className="text-teal-600">+</span>
              </summary>
              <p className="mt-4 text-sm text-stone-600">
                Donations are just as valuable! Every contribution helps us continue our mission. You can donate any amount at any time.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold text-stone-900">Get In Touch</h2>
            <p className="mt-4 text-stone-600">
              Have questions? Want to learn more? We'd love to hear from you. Reach out to our team and we'll get back to you as soon as possible.
            </p>
            <div className="mt-8 space-y-6">
              <div className="flex gap-4">
                <span className="text-2xl">📍</span>
                <div>
                  <p className="font-semibold text-stone-900">Address</p>
                  <p className="text-sm text-stone-600">Phnom Penh, Cambodia</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-2xl">📧</span>
                <div>
                  <p className="font-semibold text-stone-900">Email</p>
                  <p className="text-sm text-teal-600"><a href="mailto:info@hand4hope.org">info@hand4hope.org</a></p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-2xl">📱</span>
                <div>
                  <p className="font-semibold text-stone-900">Phone</p>
                  <p className="text-sm text-stone-600">+855 (0) 23 123 456</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-teal-50 to-amber-50 p-8 border border-teal-100">
            <h3 className="font-semibold text-stone-900">Quick Contact Form</h3>
            <form className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-lg border border-stone-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-lg border border-stone-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <textarea
                placeholder="Your message"
                rows="4"
                className="w-full rounded-lg border border-stone-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              ></textarea>
              <Link to="/contact">
                <Button className="w-full">Send Message</Button>
              </Link>
            </form>
          </div>
        </div>
      </section>

      {/* Volunteers Keep Programs Joyful Section */}
      <section className="border-t border-teal-100 bg-teal-50/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-teal-900">Volunteers keep programs joyful</h2>
            <p className="mt-2 max-w-xl text-teal-900/80">
              Help with classrooms, outings, translation, or logistics. We provide safeguarding training for every role.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/register">
              <Button>Create volunteer profile</Button>
            </Link>
            <Link to="/events">
              <Button variant="outline">Explore events</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
