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

  const heroTitle    = contents?.hero_title    || 'Spend a Saturday. Help your neighbourhood.'
  const heroSubtitle = contents?.hero_subtitle || 'Hand4Hope runs small, weekend-friendly volunteer events around Phnom Penh. Bring yourself, bring a friend, leave a place a bit better than you found it.'
  const mission      = contents?.mission_text  || ''
  const preview      = useMemo(() => events || [], [events])

  if (loading) return <Spinner />

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative min-h-screen overflow-hidden bg-primary-50 pt-20 dark:bg-slate-900 md:pt-32">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary-300/30 blur-3xl"
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent-300/30 blur-3xl"
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
                  <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">Run by volunteers, every weekend</span>
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
                    See this weekend
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="lg">Sign up to help</Button>
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-primary-400 dark:border-slate-800" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">85 regulars and counting</span>
                  <div className="flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-300"><Star className="h-4 w-4 fill-accent-400 text-accent-400" /> Free to join</div>
                </div>
                
              </motion.div>
            </motion.div>

            {/* Right — Mission card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative min-h-96 md:h-full"
            >
              <div className="glass relative h-full rounded-3xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                      What we're up to
                    </p>
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 dark:bg-emerald-900/30">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
                        Active today
                      </span>
                    </span>
                  </div>

                  <p className="font-display text-xl leading-relaxed text-slate-800 dark:text-slate-200">
                    {mission}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-white/60 p-4 backdrop-blur dark:bg-slate-800/50">
                      <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400">
                        <Users className="h-4 w-4" />
                      </div>
                      <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                        <CountUp end={500} />+
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Kids reached this year
                      </p>
                    </div>
                    <div className="rounded-xl bg-white/60 p-4 backdrop-blur dark:bg-slate-800/50">
                      <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary-100 text-secondary-600 dark:bg-secondary-900/40 dark:text-secondary-400">
                        <Heart className="h-4 w-4" />
                      </div>
                      <p className="text-3xl font-bold text-secondary-600 dark:text-secondary-400">
                        <CountUp end={85} />
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
                        People who keep showing up
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 border-t border-slate-200/60 pt-5 dark:border-slate-700/60">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      What we run
                    </p>
                    {[
                      { icon: HandHeart,     text: 'Weekend clean-ups in different sangkats' },
                      { icon: GraduationCap, text: 'Free workshops where volunteers teach what they know' },
                      { icon: Stethoscope,   text: 'Help-desk days for paperwork and school enrolment' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-sm">
                        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                          <item.icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-slate-700 dark:text-slate-300">{item.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200/60 pt-4 dark:border-slate-700/60">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-accent-400 text-accent-400" />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Receipts posted every month
                      </span>
                    </div>
                    <Link
                      to="/about"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      How we started <ArrowRight className="h-3 w-3" />
                    </Link>
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
                The year so far
              </h2>
            </FadeInUp>
          </div>
          <StaggerContainer>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-4 md:gap-8">
              {[
                { icon: Users,      number: 120,   label: 'Kids reached',         suffix: '' },
                { icon: Heart,      number: 85,    label: 'Regular volunteers',   suffix: '' },
                { icon: TrendingUp, number: 6400,  label: 'Donated by you',       prefix: '$', suffix: '' },
                { icon: Zap,        number: 38,    label: 'Saturdays out so far', suffix: '' },
              ].map((stat, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    className="group card p-4 text-center sm:p-6 md:p-8"
                    whileHover={{ y: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <motion.div
                      className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-100 transition-all group-hover:bg-primary-200 dark:bg-primary-900/50 sm:h-14 sm:w-14 md:mb-4 md:h-16 md:w-16"
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
      <section className="border-t border-slate-200/50 bg-slate-50 to-white py-12 dark:border-slate-700/50 dark:bg-slate-800 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mb-8 text-center md:mb-12">
              <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-slate-100 sm:text-4xl md:text-5xl">
                What a Saturday looks like
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-400 md:mt-4 md:text-lg">
                Pick one. Show up. Most events are 2–3 hours and we feed you afterwards.
              </p>
            </div>
          </FadeInUp>
          <StaggerContainer>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
              {[
                { icon: HandHeart,     title: 'Clean-up mornings',     desc: 'One street or one park, bin bags and gloves provided.' },
                { icon: GraduationCap, title: 'Skill-share workshops', desc: 'Whatever you know how to do — cooking, basic repairs, photo editing.' },
                { icon: MessageCircle, title: 'Help desk',             desc: 'A lawyer and two case workers help families with paperwork.' },
                { icon: Users,         title: 'Family picnics',        desc: 'Bring something to share. Meet people who live two doors down.' },
                { icon: Smile,         title: 'Sports days',           desc: 'Pickup games. No teams pre-formed, no experience needed.' },
                { icon: Stethoscope,   title: 'First-aid days',        desc: 'Free check-ups with two partner clinics every quarter.' },
                { icon: BookOpen,      title: 'Tutor evenings',        desc: 'Read with kids who are catching up on English or maths.' },
                { icon: Heart,         title: 'When things go wrong',  desc: 'Floods, fires — we get a group out within a couple of hours.' },
              ].map((program, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    className="card group h-full p-4 sm:p-6"
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-100 transition-all group-hover:bg-primary-200 dark:bg-primary-900/50 sm:mb-4 sm:h-12 sm:w-12">
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
      <section className="bg-white py-12 dark:bg-slate-900 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:mb-8 sm:gap-4 md:mb-12 md:flex-row md:items-end md:gap-6">
              <div>
                <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100 sm:text-4xl md:text-5xl">
                  Coming up
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400 sm:mt-3 sm:text-base md:mt-4 md:text-lg">
                  Next three events on the calendar
                </p>
              </div>
              <Link
                to="/events"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 sm:gap-2 sm:text-base"
              >
                See the full calendar
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
              </Link>
            </div>
          </FadeInUp>
          <StaggerContainer>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 md:gap-8">
              {preview.length === 0 ? (
                <StaggerItem>
                  <p className="py-12 text-center text-lg text-slate-600 dark:text-slate-400 sm:col-span-2 md:col-span-3">
                    Calendar is empty for now. We'll post the next one on Telegram.
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
      <section className="border-y border-slate-200/50 bg-primary-50/50 py-12 dark:border-slate-700/50 dark:bg-slate-900 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <FadeInUp>
              <div className="space-y-6">
                <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-slate-100 sm:text-4xl md:text-5xl">
                  Why people come back
                </h2>
                <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                  We're not slick. We're not big. There's a Telegram group, a list of next Saturdays, and a few people who'll text you a reminder. That's basically it. Most volunteers come for one event, like the people, and stick around.
                </p>
                <StaggerContainer delay={0.2}>
                  {[
                    { icon: Check, title: 'Come when you can', desc: 'One Saturday a month is plenty. No pressure to do more.' },
                    { icon: Check, title: 'Nothing to prepare',  desc: 'We bring the gloves, bin bags, water, snacks.' },
                    { icon: Check, title: 'You\'ll know someone', desc: 'After two events you\'ll see familiar faces every time.' },
                    { icon: Check, title: 'You\'ll see the work', desc: 'Photos before and after, every event, posted within a day.' },
                  ].map((item, i) => (
                    <StaggerItem key={i}>
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500">
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
                    Sign me up
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
                <div className="absolute inset-0 bg-primary-500/10" />
                <div className="relative flex h-full flex-col justify-center space-y-4 p-8">
                  {[
                    { icon: Users,         title: 'A regular crew',     desc: 'Same faces, different sangkat each weekend' },
                    { icon: GraduationCap, title: 'You\'ll pick things up', desc: 'Basic first aid, organising small events, group logistics' },
                    { icon: Star,          title: 'No awards, no badges', desc: 'Just the photos and the people who turned up with you' },
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
                Help pay for the next one
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400 sm:mt-3 sm:text-base md:mt-4 md:text-lg">
                We don't have donors with big cheques. Most of what we spend is gloves, bin bags, drinking water, and tuk-tuks to get supplies there.
              </p>
            </div>
          </FadeInUp>
          <StaggerContainer>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-3 md:gap-8">
              {[
                { price: 25,  title: 'Gloves & bin bags',  desc: 'Enough for one clean-up morning of about 15 people', icon: BookOpen },
                { price: 100, title: 'A whole Saturday',   desc: 'Supplies, water, snacks, tuk-tuk hire for one event',  icon: Target, popular: true },
                { price: 500, title: 'A whole quarter',    desc: 'Roughly three months of weekend events',               icon: Heart },
              ].map((plan, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    className={`card relative overflow-hidden p-4 transition-all sm:p-6 md:p-8 ${plan.popular ? 'ring-2 ring-primary-500 md:scale-105' : ''}`}
                    whileHover={{ y: -10 }}
                  >
                    {plan.popular && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                        <span className="inline-block rounded-full bg-accent-500 px-3 py-0.5 text-[10px] font-bold text-white sm:px-4 sm:py-1 sm:text-xs">
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
                        Give this amount
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
                How this actually works
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400 sm:mt-3 sm:text-base md:mt-4 md:text-lg">
                Three steps. Should take you about five minutes.
              </p>
            </div>
          </FadeInUp>
          <StaggerContainer>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-3 md:gap-8">
              {[
                { step: 1, title: 'Make an account',     desc: 'Name, email, password. That\'s it.',                   link: '/register', linkText: 'Sign up' },
                { step: 2, title: 'Pick a Saturday',     desc: 'Look at the calendar, pick one you can make.',         link: '/events',   linkText: 'See events' },
                { step: 3, title: 'Turn up',             desc: 'We\'ll meet at the spot 15 min before and brief you.', link: '/events',   linkText: 'Find one near you' },
              ].map((item, i) => (
                <StaggerItem key={i}>
                  <motion.div className="card relative p-4 text-center sm:p-6 md:p-8" whileHover={{ y: -8 }}>
                    <motion.div
                      className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 font-display text-lg font-bold text-white sm:mb-6 sm:h-14 sm:w-14 sm:rounded-2xl sm:text-2xl"
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
                What people say after their first one
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:mt-3 sm:text-base md:mt-4 md:text-lg">
                Pulled straight from our Telegram group. No edits.
              </p>
            </div>
          </FadeInUp>
          <StaggerContainer>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-3 md:gap-8">
              {[
                { name: 'Sophea Chan',    role: 'Volunteer, Tuol Kork',   quote: 'Honestly the first one I came to mostly because a friend dragged me. By the end I was the one organising water for everyone.' },
                { name: 'Borey Khun',     role: 'First-timer last month', quote: 'I thought it would be awkward. It wasn\'t. Show up, somebody hands you a bin bag, you start walking.' },
                { name: 'Channary Sok',   role: 'Monthly donor',          quote: 'I can\'t make it most Saturdays so I just send money instead. They send the receipts to the group, which I appreciate.' },
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
      <section className="border-t border-slate-200/50 bg-slate-50 py-10 dark:border-slate-700/50 dark:bg-slate-800 sm:py-12 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="mb-6 text-center sm:mb-8 md:mb-12">
              <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-slate-100 sm:text-4xl md:text-5xl">
                Things people usually ask
              </h2>
            </div>
          </FadeInUp>
          <StaggerContainer>
            <div className="space-y-3 sm:space-y-4">
              {[
                { q: 'Do I need to know anything to come?',       a: 'No. Most events are picking up rubbish or carrying boxes. The person running it will tell you what to do when you get there.' },
                { q: 'How often do I have to come?',              a: 'As often as you feel like. People come once a month, once a quarter, or every weekend. Nobody chases you.' },
                { q: 'What\'s the minimum age?',                  a: '16. Under 18 we need a parent\'s number in the form, and they should know where you\'re going.' },
                { q: 'Can I get a tax receipt?',                  a: 'For donations of $50 and up, yes — email us with your donation reference and we\'ll send one within a week.' },
                { q: 'I want to help but can\'t come in person.', a: 'Send a small donation, or share our Telegram link with a friend who lives in Phnom Penh. Both help.' },
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
      <section className="relative overflow-hidden border-t border-slate-200/50 bg-primary-600 py-12 dark:border-slate-700/50 md:py-24">
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <FadeInUp>
            <h2 className="text-3xl font-display font-bold text-white sm:text-4xl md:text-5xl">
              See you on Saturday?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
              Either come help, or chip in a bit for the next one. Both are useful.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button
                  size="lg"
                  variant="primary"
                  className="bg-white! text-primary-700! hover:bg-slate-50! hover:text-primary-800!"
                >
                  Sign me up
                </Button>
              </Link>
              <Link to="/donate">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white! text-white! hover:bg-white/10!"
                >
                  Send some money
                </Button>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>
    </div>
  )
}
