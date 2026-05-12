import { motion } from 'framer-motion'
import { Cookie, Settings, BarChart3, Sparkles, Mail, Shield } from 'lucide-react'
import LegalPageLayout, { LegalSection } from '../components/legal/LegalPageLayout'

const cookieTable = [
  {
    name: 'hand4hope_token',
    purpose: 'Keeps you signed in across visits.',
    type: 'Essential',
    duration: 'Until logout',
  },
  {
    name: 'hand4hope_user',
    purpose: 'Caches your basic profile data so the UI loads quickly.',
    type: 'Essential',
    duration: 'Until logout',
  },
  {
    name: 'hand4hope_theme',
    purpose: 'Remembers your light/dark mode preference.',
    type: 'Preference',
    duration: '1 year',
  },
  {
    name: '_ga / _ga_*',
    purpose: 'Anonymous analytics — counts visits and pages viewed.',
    type: 'Analytics',
    duration: '13 months',
  },
]

export default function CookiePolicy() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Cookie Policy"
      effectiveDate="May 10, 2026"
      icon={Cookie}
      intro="This Cookie Policy explains how Hand4Hope uses cookies and similar technologies to recognise you when you visit our website. It tells you what cookies are, which ones we use, and how you can control them."
    >
      <LegalSection icon={Cookie} title="1. What are cookies?">
        <p>
          Cookies are small text files placed on your device when you visit a website.
          They allow the site to remember your actions and preferences (login, theme,
          language) over a period of time, so you don't have to re-enter them every
          time you come back. Some cookies live only for one browsing session, while
          others persist on your device until they expire or are cleared.
        </p>
        <p>
          We also use related technologies — such as <em>localStorage</em> — to store
          settings locally in your browser without sending them to our servers.
        </p>
      </LegalSection>

      <LegalSection icon={Shield} title="2. Why we use cookies">
        <p>Hand4Hope uses cookies for four main reasons:</p>
        <ul>
          <li><strong>Essential</strong> — to keep you signed in and to operate core features like donations and event RSVPs. The site cannot function without these.</li>
          <li><strong>Preferences</strong> — to remember your dark/light mode and other personalisation choices.</li>
          <li><strong>Analytics</strong> — to understand how visitors use the site so we can improve it. These cookies are anonymised.</li>
          <li><strong>Communications</strong> — when you opt in to newsletters, to make sure we don't send the same announcement twice.</li>
        </ul>
      </LegalSection>

      <LegalSection icon={BarChart3} title="3. Cookies we currently use">
        <div className="not-prose -mx-2 mt-4 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Name</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Purpose</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Type</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {cookieTable.map((c) => (
                <tr key={c.name} className="bg-white dark:bg-slate-900/40">
                  <td className="px-4 py-3 font-mono text-xs text-primary-700 dark:text-primary-300">{c.name}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{c.purpose}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                      {c.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{c.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Specific cookie names may vary slightly as we update our analytics tools.
          We will keep this list up to date.
        </p>
      </LegalSection>

      <LegalSection icon={Sparkles} title="4. Third-party cookies">
        <p>
          Some pages may include content from third parties — such as embedded videos
          or social media widgets — that set their own cookies. We do not control
          these cookies. Please consult the privacy policies of those services for
          more information. We do not use advertising cookies and do not sell or
          share your browsing behaviour with advertisers.
        </p>
      </LegalSection>

      <LegalSection icon={Settings} title="5. How to manage cookies">
        <p>You have several ways to control cookies:</p>
        <ul>
          <li><strong>Browser settings:</strong> All major browsers let you block, allow or delete cookies. See the help pages for Chrome, Firefox, Safari or Edge.</li>
          <li><strong>Clear local data:</strong> You can clear our localStorage entries at any time by logging out or clearing site data in your browser.</li>
          <li><strong>Opt-out of analytics:</strong> If you have installed Google Analytics opt-out add-ons, our analytics will respect those.</li>
          <li><strong>Do Not Track:</strong> We honour the "Do Not Track" signal where supported by your browser.</li>
        </ul>
        <p>
          Please note that disabling essential cookies will break functionality such
          as login and donation flows. Disabling preference or analytics cookies will
          not prevent you from using the site.
        </p>
      </LegalSection>

      <LegalSection icon={Cookie} title="6. Changes to this policy">
        <p>
          We may update this Cookie Policy from time to time to reflect changes in
          the cookies we use or for legal or regulatory reasons. The "effective date"
          at the top of the page tells you when the latest version was published.
        </p>
      </LegalSection>

      <LegalSection icon={Mail} title="7. Contact us">
        <p>If you have questions about this Cookie Policy, please reach out:</p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:privacy@hand4hope.org">privacy@hand4hope.org</a></li>
          <li><strong>Post:</strong> Hand4Hope, Phnom Penh, Cambodia</li>
        </ul>
      </LegalSection>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-12 rounded-2xl border border-primary-100 bg-primary-50/60 p-5 text-sm text-slate-600 dark:border-primary-900/40 dark:bg-primary-900/20 dark:text-slate-300"
      >
        Cookies help us deliver a smooth, personalised experience while keeping your
        data safe. Thanks for taking the time to understand how we use them.
      </motion.p>
    </LegalPageLayout>
  )
}
