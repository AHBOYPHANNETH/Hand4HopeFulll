import { motion } from 'framer-motion'
import { Shield, Lock, Database, UserCheck, Mail, FileText } from 'lucide-react'
import LegalPageLayout, { LegalSection } from '../components/legal/LegalPageLayout'

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Privacy Policy"
      effectiveDate="May 10, 2026"
      icon={Shield}
      intro="Hand4Hope is committed to protecting the privacy of every volunteer, donor, family and partner who interacts with our programs. This policy explains what information we collect, how we use it, and the rights you have over your personal data."
    >
      <LegalSection icon={Database} title="1. Information we collect">
        <p>
          We collect information directly from you when you create an account, register
          for events, make a donation, or contact us. The categories of personal data we
          handle include:
        </p>
        <ul>
          <li><strong>Account data:</strong> name, email address, password (stored as a hash), profile photo (optional).</li>
          <li><strong>Volunteer data:</strong> role preferences, availability, emergency contact, training records.</li>
          <li><strong>Donation data:</strong> donor name, billing address, amount, payment confirmation reference. We do not store full card numbers — payments are processed by our PCI-compliant payment partners.</li>
          <li><strong>Communications:</strong> messages you send through the contact form, email replies and feedback.</li>
          <li><strong>Technical data:</strong> IP address, browser type, device type, pages visited, collected through standard server logs and cookies.</li>
        </ul>
      </LegalSection>

      <LegalSection icon={UserCheck} title="2. How we use your information">
        <p>We use your information only for legitimate purposes connected to our mission:</p>
        <ul>
          <li>Coordinate volunteer placements and event attendance.</li>
          <li>Process donations and issue tax receipts where applicable.</li>
          <li>Send service messages (event reminders, status updates, receipts).</li>
          <li>Send mission updates or newsletters — only if you opt in. You can unsubscribe at any time.</li>
          <li>Improve the safety, performance and accessibility of our programs and website.</li>
          <li>Comply with legal obligations and safeguarding requirements for working with children.</li>
        </ul>
      </LegalSection>

      <LegalSection icon={Lock} title="3. How we protect your data">
        <p>
          Personal data is encrypted in transit (HTTPS) and at rest. Access is restricted
          to authorised staff who need it to perform their role. We follow industry
          best-practice for password storage, session security and dependency patching,
          and we review our security posture regularly.
        </p>
        <p>
          Despite our safeguards, no online service can be guaranteed perfectly secure. If
          we ever discover a data breach affecting your information, we will notify you
          and the relevant authorities without undue delay.
        </p>
      </LegalSection>

      <LegalSection icon={FileText} title="4. Sharing and third parties">
        <p>
          We do not sell or rent your personal data. We share data only with trusted
          processors who help us run the service:
        </p>
        <ul>
          <li>Payment processors for handling donations.</li>
          <li>Cloud hosting providers for storing application data.</li>
          <li>Email delivery providers for sending transactional and opt-in messages.</li>
          <li>Government or regulatory bodies, only when legally required.</li>
        </ul>
        <p>
          All processors are bound by contracts that require them to handle your data
          confidentially and only for the purposes we specify.
        </p>
      </LegalSection>

      <LegalSection icon={UserCheck} title="5. Your rights">
        <p>You can exercise the following rights over your personal data at any time:</p>
        <ul>
          <li><strong>Access</strong> — request a copy of the data we hold about you.</li>
          <li><strong>Correction</strong> — ask us to fix inaccurate or incomplete data.</li>
          <li><strong>Deletion</strong> — request that we erase your account and personal data, subject to legal retention obligations.</li>
          <li><strong>Withdraw consent</strong> — opt out of newsletters or marketing communications at any time.</li>
          <li><strong>Restriction</strong> — limit how we process your data while a concern is investigated.</li>
        </ul>
        <p>
          To exercise any of these rights, email us at the address below. We respond to
          all requests within 30 days.
        </p>
      </LegalSection>

      <LegalSection icon={Database} title="6. Data retention">
        <p>
          We retain personal data only as long as necessary for the purpose it was
          collected. Volunteer records are kept for the duration of active participation
          plus three years for safeguarding documentation. Donation records are kept
          for the period required by Cambodian tax law. Account data is deleted within
          90 days of account closure unless retention is legally required.
        </p>
      </LegalSection>

      <LegalSection icon={Shield} title="7. Children's privacy">
        <p>
          Our website is intended for volunteers and supporters aged 16 and above.
          Volunteers under 18 require parental or guardian consent. We do not knowingly
          collect personal data directly from children under 16. Information about the
          children supported by our programs is recorded by authorised programme staff
          only, with the consent of parents or legal guardians.
        </p>
      </LegalSection>

      <LegalSection icon={FileText} title="8. Changes to this policy">
        <p>
          We may update this Privacy Policy occasionally to reflect changes in our
          practices, technology or law. The "effective date" at the top of this page
          tells you when the current version was published. Material changes will be
          announced on this page and, where appropriate, by email to registered users.
        </p>
      </LegalSection>

      <LegalSection icon={Mail} title="9. Contact us">
        <p>
          For any privacy-related question or to exercise your rights, please reach out:
        </p>
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
        By using Hand4Hope, you acknowledge that you have read and understood this
        Privacy Policy.
      </motion.p>
    </LegalPageLayout>
  )
}
