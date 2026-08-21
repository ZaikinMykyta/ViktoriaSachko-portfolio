import { Container } from '@/shared/ui/container'
import { siteConfig } from '@/shared/config/site.config'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container className="footer-inner">
        <span>{siteConfig.copyright}</span>
        <a href="#top">Back to top</a>
      </Container>
    </footer>
  )
}
