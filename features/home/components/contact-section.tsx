import { ArrowUpRight } from 'lucide-react'
import { Container } from '@/shared/ui/container'
import { SectionLabel } from '@/shared/ui/section-label'
import { siteConfig } from '@/shared/config/site.config'

export function ContactSection() {
  return (
    <section className="contact section" id="contact">
      <Container className="contact-inner">
        <SectionLabel>Contact</SectionLabel>
        <h2>Let&apos;s create together.</h2>
        <p className="contact-text">Відкрита до нових проєктів та співпраці.</p>
        <div className="contact-links">
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
              siteConfig.contact.email,
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            {siteConfig.contact.email} <ArrowUpRight />
          </a>
          <a href={`tel:${siteConfig.contact.phone.replace(/[^\d+]/g, '')}`}>
            {siteConfig.contact.phone} <ArrowUpRight />
          </a>
          <a href={siteConfig.contact.telegram}>
            Telegram <ArrowUpRight />
          </a>
        </div>
      </Container>
    </section>
  )
}
