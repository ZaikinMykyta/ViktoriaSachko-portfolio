import { Container } from '@/shared/ui/container'
import { siteConfig } from '@/shared/config/site.config'

type HeroSectionProps = {
  imageUrl: string
}

export function HeroSection({ imageUrl }: HeroSectionProps) {
  return (
    <section className="hero">
      <img src={imageUrl} alt={`${siteConfig.name} portfolio`} className="hero-bg" />
      <Container className="hero-inner">
        <p className="hero-label">{siteConfig.tagline}</p>
        <h1>Viktoria Sachko</h1>
      </Container>
    </section>
  )
}
