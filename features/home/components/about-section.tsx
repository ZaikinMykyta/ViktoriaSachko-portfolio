import { Container } from '@/shared/ui/container'
import { SectionLabel } from '@/shared/ui/section-label'

export function AboutSection() {
  return (
    <section className="about section" id="about">
      <Container>
        <SectionLabel>ABOUT ME</SectionLabel>
        <div className="about-grid">
          {/* <img src="/IMG_8468.jpg" className="w-full h-full object-cover object-center rounded-full" 
          style={{
            display: 'grid',
            gridTemplateColumns: '400px 1fr',
            gap: '80px',
            alignItems: 'center',
            width: '400px !important',
            height: '400px !important !important',
            borderRadius: '50% !important',
            overflow: 'hidden',
            transition: 'transform 0.5s ease',
            maxWidth: '600px !important',
          }}
          alt="Viktoria Sachko" /> */}
          <div
            style={{
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              overflow: 'hidden',
            }}
          >
            <img
              src="/IMG_8468.jpg"
              alt="Viktoria Sachko"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
          <div className="about-copy">
            <p>
            Я — фотограф та відеограф у сфері
            fashion та комерційного контенту.
            Працюю з брендами, моделями та
            приватними клієнтами. Маю близько 2
            років досвіду у фотографії та
            відеографії.Створюю контент, який
            передає індивідуальність, характер та
            концепцію бренду
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
