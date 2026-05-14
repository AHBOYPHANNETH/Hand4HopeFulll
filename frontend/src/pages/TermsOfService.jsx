import { motion } from 'framer-motion'
import { ScrollText, UserCheck, Heart, AlertTriangle, ShieldCheck, Mail, Scale, Ban } from 'lucide-react'
import LegalPageLayout, { LegalSection } from '../components/legal/LegalPageLayout'

export default function TermsOfService() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Terms of Service"
      effectiveDate="May 10, 2026"
      icon={ScrollText}
      intro="These Terms of Service govern your use of the Hand4Hope website, mobile experiences, and the volunteering and donation programs we coordinate. By creating an account or using any part of the service, you agree to these terms."
    >
      <LegalSection icon={UserCheck} title="1. Eligibility & accounts">
        <p>To use the Hand4Hope service, you confirm that:</p>
        <ul>
          <li>You are at least 16 years old, or have the consent of a parent or legal guardian if under 18.</li>
          <li>The information you provide when registering is accurate, current, and complete.</li>
          <li>You will keep your password confidential and notify us immediately of any unauthorised access.</li>
          <li>You will not share your account with another person or impersonate someone else.</li>
        </ul>
        <p>
          You are responsible for any activity that takes place under your account.
        </p>
      </LegalSection>

      <LegalSection icon={Heart} title="2. Volunteer participation">
        <p>
          Volunteering with Hand4Hope is a privilege built on trust. When signing up for
          an event or program, you agree to:
        </p>
        <ul>
          <li>Attend the events you have committed to, or cancel in good time if circumstances change.</li>
          <li>Complete required safeguarding training before working with children or families.</li>
          <li>Treat children, families, staff and fellow volunteers with respect and dignity.</li>
          <li>Maintain confidentiality of all personal information you encounter through your role.</li>
          <li>Follow all instructions from program coordinators, including health and safety policies.</li>
        </ul>
        <p>
          We reserve the right to decline or revoke a volunteer placement at any time
          if these expectations are not met. Volunteer placements are not employment
          and do not create any employer–employee relationship.
        </p>
      </LegalSection>

      <LegalSection icon={ShieldCheck} title="3. Donations">
        <p>
          Donations made through Hand4Hope directly support our mission. By making a
          donation, you confirm that the funds are legally yours to give and that you
          are using legitimate payment methods.
        </p>
        <ul>
          <li>Donations are generally non-refundable. If you believe a donation was made in error, contact us within 14 days and we will review on a case-by-case basis.</li>
          <li>We provide a digital receipt for every successful donation.</li>
          <li>Tax-deductibility depends on your country of residence — please consult your local tax adviser.</li>
        </ul>
      </LegalSection>

      <LegalSection icon={Ban} title="4. Acceptable use">
        <p>You agree not to use Hand4Hope to:</p>
        <ul>
          <li>Post false, misleading, defamatory or abusive content.</li>
          <li>Harass, intimidate or threaten any person on or off the platform.</li>
          <li>Upload viruses, malware, or attempt to disrupt or compromise our systems.</li>
          <li>Scrape, copy or reuse content from this site without our written permission.</li>
          <li>Engage in fraudulent activity, including manipulating donation totals or exploiting volunteer credit.</li>
          <li>Use the platform for political campaigning, commercial solicitation or spam.</li>
        </ul>
        <p>
          We may suspend or terminate accounts that violate these rules, with or
          without notice.
        </p>
      </LegalSection>

      <LegalSection icon={ScrollText} title="5. Content and intellectual property">
        <p>
          All content on Hand4Hope — including text, images, logos, graphics and code —
          is owned by Hand4Hope or used with permission. You may not reproduce,
          distribute, or create derivative works from our content without prior written
          consent.
        </p>
        <p>
          Anything you submit (event feedback, profile photos, public messages) remains
          yours. By submitting, you grant Hand4Hope a non-exclusive, royalty-free
          licence to use the content to operate, promote and improve our programs,
          consistent with our Privacy Policy.
        </p>
      </LegalSection>

      <LegalSection icon={AlertTriangle} title="6. Disclaimers">
        <p>
          Hand4Hope provides the service on an "as available" basis. While we work
          hard to keep everything accurate and reliable, we make no warranty that the
          site will be uninterrupted, error-free, or completely secure.
        </p>
        <p>
          Volunteer activities take place in real-world settings and carry inherent
          risks. Volunteers are responsible for following safety guidance and for
          ensuring they have appropriate insurance where required.
        </p>
      </LegalSection>

      <LegalSection icon={Scale} title="7. Limitation of liability">
        <p>
          To the fullest extent permitted by Cambodian law, Hand4Hope and its staff,
          trustees and volunteers shall not be liable for indirect, incidental,
          consequential or punitive damages arising out of your use of the service or
          participation in any program.
        </p>
        <p>
          Where liability cannot be excluded, our total aggregate liability is limited
          to the amount you paid (if any) to Hand4Hope in the twelve months preceding
          the claim.
        </p>
      </LegalSection>

      <LegalSection icon={ShieldCheck} title="8. Account suspension and termination">
        <p>
          You can close your account at any time from your profile settings or by
          emailing us. We may suspend or terminate accounts that breach these terms,
          jeopardise the safety of our beneficiaries, or where required by law.
          Termination does not affect rights or obligations that arose before the
          account was closed.
        </p>
      </LegalSection>

      <LegalSection icon={ScrollText} title="9. Changes to these terms">
        <p>
          We may update these Terms occasionally. Significant changes will be
          communicated by email or a prominent notice on the site. Continued use of
          Hand4Hope after the effective date of the updated terms constitutes
          acceptance of the changes.
        </p>
      </LegalSection>

      <LegalSection icon={Scale} title="10. Governing law">
        <p>
          These Terms are governed by the laws of the Kingdom of Cambodia. Any
          dispute arising from these Terms will be resolved through good-faith
          discussion first and, failing that, by the competent courts of Phnom Penh.
        </p>
      </LegalSection>

      <LegalSection icon={Mail} title="11. Contact us">
        <p>Questions about these Terms? Reach out:</p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:legal@hand4hope.org">legal@hand4hope.org</a></li>
          <li><strong>Post:</strong> Hand4Hope, Phnom Penh, Cambodia</li>
        </ul>
      </LegalSection>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-12 rounded-2xl border border-primary-100 bg-primary-50/60 p-5 text-sm text-slate-600 dark:border-primary-900/40 dark:bg-primary-900/20 dark:text-slate-300"
      >
        Thank you for being part of Hand4Hope. Every event, every volunteer hour,
        every small gift — together we keep the community moving forward.
      </motion.p>
    </LegalPageLayout>
  )
}
