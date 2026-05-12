import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, ArrowRight, Zap, Users, Heart, TrendingUp, Star, BookOpen, Target, GraduationCap, Check, MessageCircle, Stethoscope, Smile, HandHeart } from 'lucide-react'
import EventCard from '../components/EventCard'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import { FadeInUp, FadeIn, ScaleIn, StaggerContainer, StaggerItem, FloatingElement, CountUp } from '../components/animations/AnimatedElements'
import { fetchEvents } from '../services/eventService'
import { fetchPublicContents } from '../services/contentService'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
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
          fetchEvents(),
        ])
        if (!cancelled) {
          setContents(c)
          setEvents(ev.slice(0, 12))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const heroTitle    = contents?.hero_title    || 'Hands of Hope for Every Child'
  const heroSubtitle = contents?.hero_subtitle || 'Supporting children with intellectual disabilities through daycare, education, and advocacy in Cambodia.'
  const mission      = contents?.mission_text  || ''
  const preview      = useMemo(() => events || [], [events])

  if (loading) return <Spinner />

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 md:pt-32">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-gradient-to-r from-primary-300/30 to-secondary-300/30 blur-3xl"
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
            {/* Left */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
              <motion.div variants={itemVariants} className="inline-flex">
                <div className="flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50/80 px-4 py-2 backdrop-blur-sm dark:border-primary-800 dark:bg-primary-900/30">
                  <Zap className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">Empowering Communities</span>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-4">
                <h1 className="text-4xl font-display font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl md:text-6xl">
                  {heroTitle.split(' ').map((word, i) => (
                    <span key={i}>
                      {i % 2 === 1 ? <span className="gradient-text">{word} </span> : <span>{word} </span>}
                    </span>
                  ))}
                </h1>
                <p className="max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg md:text-xl">
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
                  <Button variant="outline" size="lg">Become a Volunteer</Button>
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-primary-400 to-secondary-400 dark:border-slate-800" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">+1,200 Volunteers</span>
                  <div className="flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-300"><Star className="h-4 w-4 fill-accent-400 text-accent-400" /> 4.9/5 Rating</div>
                </div>
                
              </motion.div>
            </motion.div>

            {/* Right — Mission card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-96 md:h-full"
            >
              <div className="glass relative h-full rounded-3xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">Mission Snapshot</p>
                  <p className="font-display text-xl leading-relaxed text-slate-800 dark:text-slate-200">{mission}</p>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="rounded-xl bg-white/50 p-4 backdrop-blur dark:bg-slate-800/50">
                      <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">500+</p>
                      <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-400">Children Supported</p>
                    </div>
                    <div className="rounded-xl bg-white/50 p-4 backdrop-blur dark:bg-slate-800/50">
                      <p className="text-3xl font-bold text-secondary-600 dark:text-secondary-400">1.2K</p>
                      <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-400">Active Volunteers</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Statistics ── */}
      <section className="border-t border-slate-200/50 bg-white py-12 dark:border-slate-700/50 dark:bg-slate-900 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center md:mb-12">
            <FadeInUp>
              <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-slate-100 sm:text-4xl md:text-5xl">
                Impact by the Numbers
              </h2>
            </FadeInUp>
          </div>
          <StaggerContainer>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-4 md:gap-8">
              {[
                { icon: Users,      number: 500,   label: 'Children Supported', suffix: '+' },
                { icon: Heart,      number: 1200,  label: 'Active Volunteers',  suffix: '+' },
                { icon: TrendingUp, number: 85000, label: 'Donations Raised', prefix: '$', suffix: '+' },
                { icon: Zap,        number: 50,    label: 'Events Hosted',      suffix: '+' },
              ].map((stat, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    className="group card p-4 text-center sm:p-6 md:p-8"
                    whileHover={{ y: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <motion.div
                      className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 transition-all group-hover:from-primary-200 group-hover:to-primary-300 dark:from-primary-900/50 dark:to-primary-800/50 sm:h-14 sm:w-14 md:mb-4 md:h-16 md:w-16"
                      whileHover={{ scale: 1.1 }}
                    >
                      <stat.icon className="h-5 w-5 text-primary-600 dark:text-primary-400 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                    </motion.div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl md:text-4xl">
                      {stat.prefix}<CountUp end={stat.number} />{stat.suffix}
                    </div>
                    <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300 sm:text-sm md:mt-3 md:text-base">{stat.label}</p>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* ── Our Programs ── */}
      <section className="border-t border-slate-200/50 bg-gradient-to-b from-slate-50 to-white py-12 dark:border-slate-700/50 dark:from-slate-800 dark:to-slate-900 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mb-8 text-center md:mb-12">
              <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-slate-100 sm:text-4xl md:text-5xl">
                Our Programs
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-400 md:mt-4 md:text-lg">
                A holistic set of services designed around the needs of children with intellectual disabilities and their families.
              </p>
            </div>
          </FadeInUp>
          <StaggerContainer>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {[
                { icon: Heart,         title: 'Daycare Support',         desc: 'Safe, nurturing daily care for children with intellectual disabilities.' },
                { icon: GraduationCap, title: 'Special Education',       desc: 'Tailored learning plans focused on each child’s strengths.' },
                { icon: MessageCircle, title: 'Speech Therapy',          desc: 'One-on-one sessions to build communication confidence.' },
                { icon: Users,         title: 'Family Counseling',       desc: 'Guidance and emotional support for caregivers and siblings.' },
                { icon: Smile,         title: 'Recreational Activities', desc: 'Sports, games and outings that foster joy and friendship.' },
                { icon: Stethoscope,   title: 'Health Screening',        desc: 'Regular checkups partnered with local clinics and volunteers.' },
                { icon: BookOpen,      title: 'Parent Workshops',        desc: 'Skill-building sessions for parents to support learning at home.' },
                { icon: HandHeart,     title: 'Community Outreach',      desc: 'Awareness campaigns reducing stigma in local communities.' },
              ].map((program, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    className="card group h-full p-4 sm:p-6"
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 transition-all group-hover:from-primary-200 group-hover:to-primary-300 dark:from-primary-900/50 dark:to-primary-800/50 sm:mb-4 sm:h-12 sm:w-12">
                      <program.icon className="h-5 w-5 text-primary-600 dark:text-primary-400 sm:h-6 sm:w-6" />
                    </div>
                    <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100 sm:text-base md:text-lg">
                      {program.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400 sm:mt-2 sm:text-sm">
                      {program.desc}
                    </p>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* ── Featured Events ── */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-12 dark:from-slate-900 dark:to-slate-800 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:mb-8 sm:gap-4 md:mb-12 md:flex-row md:items-end md:gap-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100 sm:text-4xl md:text-5xl">
                  Featured Events
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400 sm:mt-3 sm:text-base md:mt-4 md:text-lg">
                  Join meaningful gatherings and connect with our community
                </p>
              </div>
              <Link
                to="/events"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 sm:gap-2 sm:text-base"
              >
                View all events
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
              </Link>
            </div>
          </FadeInUp>
          <StaggerContainer>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 md:gap-8">
              {preview.length === 0 ? (
                <StaggerItem>
                  <p className="py-12 text-center text-lg text-slate-600 dark:text-slate-400 sm:col-span-2 md:col-span-3">
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

      {/* ── Community ── */}
      <section className="border-y border-slate-200/50 bg-gradient-to-r from-primary-50/50 via-white to-secondary-50/50 py-12 dark:border-slate-700/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <FadeInUp>
              <div className="space-y-6">
                <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-slate-100 sm:text-4xl md:text-5xl">
                  Creating a Community of Volunteers
                </h2>
                <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                  Together, we're building an inclusive community where every person has the opportunity to contribute, learn, and make a meaningful impact in the lives of children with intellectual disabilities.
                </p>
                <StaggerContainer delay={0.2}>
                  {[
                    { icon: Check, title: 'Flexible Volunteering', desc: 'Choose roles that fit your schedule' },
                    { icon: Check, title: 'Free Training',         desc: 'Comprehensive safeguarding & skills training' },
                    { icon: Check, title: 'Supportive Team',       desc: 'Work alongside passionate community members' },
                    { icon: Check, title: 'Make an Impact',        desc: "See the real difference you're making" },
                  ].map((item, i) => (
                    <StaggerItem key={i}>
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500">
                            <item.icon className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
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
              <div className="glass relative h-96 overflow-hidden rounded-3xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10" />
                <div className="relative flex h-full flex-col justify-center space-y-4 p-8">
                  {[
                    { icon: Users,         title: 'Community Events',  desc: 'Monthly meetups and training' },
                    { icon: GraduationCap, title: 'Skills Development', desc: 'Learn while helping others' },
                    { icon: Star,          title: 'Recognition',        desc: 'Celebrate your contributions' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="rounded-2xl border border-white/40 bg-white/60 p-4 backdrop-blur-sm dark:border-slate-700/40 dark:bg-slate-800/60"
                      whileHover={{ x: 10 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/40">
                          <item.icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{item.desc}</p>
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

      {/* ── Donation tiers ── */}
      <section className="bg-white py-10 dark:bg-slate-900 sm:py-12 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mb-6 text-center sm:mb-8 md:mb-12">
              <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100 sm:text-4xl md:text-5xl">
                Support Our Mission
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400 sm:mt-3 sm:text-base md:mt-4 md:text-lg">
                Your donation directly supports programs, training, and care for children with intellectual disabilities.
              </p>
            </div>
          </FadeInUp>
          <StaggerContainer>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-3 md:gap-8">
              {[
                { price: 25,  title: 'Supplies Pack',   desc: 'Educational materials for one month', icon: BookOpen },
                { price: 100, title: 'Program Support', desc: 'Weekly enrichment activities',        icon: Target, popular: true },
                { price: 500, title: 'Sponsor',         desc: 'Comprehensive support for a child',   icon: Heart },
              ].map((plan, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    className={`card relative overflow-hidden p-4 transition-all sm:p-6 md:p-8 ${plan.popular ? 'ring-2 ring-primary-500 md:scale-105' : ''}`}
                    whileHover={{ y: -10 }}
                  >
                    {plan.popular && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                        <span className="inline-block rounded-full bg-gradient-to-r from-accent-500 to-primary-600 px-3 py-0.5 text-[10px] font-bold text-white sm:px-4 sm:py-1 sm:text-xs">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/40 sm:mb-4 sm:h-14 sm:w-14 sm:rounded-2xl">
                      <plan.icon className="h-5 w-5 text-primary-600 dark:text-primary-400 sm:h-8 sm:w-8" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">${plan.price}</div>
                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100 sm:mt-2 sm:text-base">{plan.title}</p>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 sm:mt-2 sm:text-sm">{plan.desc}</p>
                    <Link to="/donate" className="mt-4 block sm:mt-6">
                      <Button className="w-full" variant={plan.popular ? 'gradient' : 'primary'}>
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

      {/* ── How to Get Started ── */}
      <section className="bg-slate-50 py-10 dark:bg-slate-800 sm:py-12 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mb-6 text-center sm:mb-8 md:mb-12">
              <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100 sm:text-4xl md:text-5xl">
                How to Get Started
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400 sm:mt-3 sm:text-base md:mt-4 md:text-lg">
                Join Hand4Hope in just a few simple steps
              </p>
            </div>
          </FadeInUp>
          <StaggerContainer>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-3 md:gap-8">
              {[
                { step: 1, title: 'Create Your Profile', desc: 'Sign up and tell us about yourself',        link: '/register', linkText: 'Register now' },
                { step: 2, title: 'Complete Training',    desc: 'Participate in our comprehensive training',  link: '/events',   linkText: 'View training' },
                { step: 3, title: 'Start Making Impact',  desc: 'Join events and volunteer at programs',      link: '/events',   linkText: 'Find events' },
              ].map((item, i) => (
                <StaggerItem key={i}>
                  <motion.div className="card relative p-4 text-center sm:p-6 md:p-8" whileHover={{ y: -8 }}>
                    <motion.div
                      className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 font-display text-lg font-bold text-white sm:mb-6 sm:h-14 sm:w-14 sm:rounded-2xl sm:text-2xl"
                      whileHover={{ scale: 1.1 }}
                    >
                      {item.step}
                    </motion.div>
                    <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100 sm:text-lg">{item.title}</h3>
                    <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 sm:mt-3 sm:text-sm">{item.desc}</p>
                    <Link
                      to={item.link}
                      className="group mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 sm:mt-6 sm:gap-2 sm:text-base"
                    >
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

      {/* ── Testimonials ── */}
      <section className="bg-white py-10 dark:bg-slate-900 sm:py-12 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mb-6 text-center sm:mb-8 md:mb-12">
              <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100 sm:text-4xl md:text-5xl">
                Voices from Our Community
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:mt-3 sm:text-base md:mt-4 md:text-lg">
                Hear from volunteers and donors who are making a difference
              </p>
            </div>
          </FadeInUp>
          <StaggerContainer>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-3 md:gap-8">
              {[
                { name: 'Sarah Johnson', role: 'Teacher & Volunteer', quote: 'Volunteering with Hand4Hope has been the most rewarding experience of my life.' },
                { name: 'Mark Chen',     role: 'New Volunteer',       quote: 'The training provided is excellent. I felt well-prepared from day one.' },
                { name: 'Emily Brown',   role: 'Donor',               quote: 'Impressed by how transparent they are with funds and their impact.' },
              ].map((t, i) => (
                <StaggerItem key={i}>
                  <motion.div className="card p-4 sm:p-6 md:p-8" whileHover={{ y: -5 }}>
                    <div className="mb-2 flex gap-1 text-accent-400 sm:mb-4">
                      {[...Array(5)].map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-accent-400 text-accent-400 sm:h-4 sm:w-4" />)}
                    </div>
                    <p className="mb-3 text-sm italic text-slate-700 dark:text-slate-300 sm:mb-6 sm:text-base md:text-lg">"{t.quote}"</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 sm:text-base">{t.name}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">{t.role}</p>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-t border-slate-200/50 bg-gradient-to-br from-slate-50 to-slate-100 py-10 dark:border-slate-700/50 dark:from-slate-800 dark:to-slate-900 sm:py-12 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mb-6 text-center sm:mb-8 md:mb-12">
              <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100 sm:text-4xl md:text-5xl">
                Frequently Asked Questions
              </h2>
            </div>
          </FadeInUp>
          <StaggerContainer>
            <div className="space-y-3 sm:space-y-4">
              {[
                { q: 'Do I need prior experience to volunteer?',  a: 'No! We welcome volunteers of all backgrounds. We provide comprehensive training for all roles.' },
                { q: 'How much time do I need to commit?',        a: "We offer flexible volunteering. You can start with a few hours a month and increase as you're able." },
                { q: 'Is there an age requirement?',              a: 'We welcome volunteers 16 and older. Those under 18 need parental consent.' },
                { q: 'Are donations tax-deductible?',             a: 'Yes! Hand4Hope is a registered non-profit. All donations are tax-deductible.' },
                { q: "Can I donate if I can't volunteer?",        a: 'Absolutely! Donations are just as valuable and help us continue our mission.' },
              ].map((faq, i) => (
                <StaggerItem key={i}>
                  <details className="group card cursor-pointer p-4 sm:p-6">
                    <summary className="flex list-none items-center justify-between gap-3 text-sm font-semibold text-slate-900 dark:text-slate-100 sm:text-base">
                      <span className="flex items-start gap-2 sm:items-center sm:gap-3">
                        <span className="font-bold text-primary-600 dark:text-primary-400">?</span>
                        {faq.q}
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-primary-600 transition-transform group-open:rotate-90 dark:text-primary-400 sm:h-5 sm:w-5" />
                    </summary>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400 sm:mt-4 sm:text-sm">{faq.a}</p>
                  </details>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden border-t border-slate-200/50 bg-gradient-to-r from-primary-600 to-secondary-600 py-12 dark:border-slate-700/50 md:py-24">
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <FadeInUp>
            <h2 className="text-3xl font-display font-bold text-white sm:text-4xl md:text-5xl">
              Ready to Make a Difference?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
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
