import Navbar from '../components/Navbar/Navbar'
import Hero from '../components/Hero/Hero'
import Features from '../components/Features/Features'
import HowItWorks from '../components/HowItWorks/HowItWorks'
import Demo from '../components/Demo/Demo'
import Roadmap from '../components/Roadmap/Roadmap'
import Footer from '../components/Footer/Footer'
import ParticleBackground from '../components/ui/ParticleBackground'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background text-text-primary overflow-x-hidden">
      <ParticleBackground />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <HowItWorks />
          <Demo />
          <Roadmap />
        </main>
        <Footer />
      </div>
    </div>
  )
}
