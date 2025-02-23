import React, { Dispatch, SetStateAction } from 'react'
import { Button } from "@/components/ui/button"
import { UserReviewsSection } from './UserReviewsSection'

const LandingPage = ({
  setIsApp,
}: {
  setIsApp: Dispatch<SetStateAction<boolean>>
}) => {
  // Scroll to top on "Start Saving Now" demo (or actual usage)
  const handleGetStarted = (): void => {
    setIsApp(true)
  }

  // Scroll to specific section
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Scroll to top function (for the bottom-right button)
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="w-full min-h-screen relative">
      
      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full bg-white/50 backdrop-blur-md shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <img
              src="/assets/images/ClaimCure.png"
              alt="Logo"
              className="h-12 w-auto"
            />
            <span className="claimcure text-3xl font-bold">
              <span className="claim">Claim</span>
              <span className="cure">Cure</span>
            </span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <Button
              style={{ transition: 'all 0.3s ease-in-out' }}
              className="border border-white text-white bg-blue-300 hover:bg-red-300 hover:text-white"
              onClick={() => scrollToSection("features-section")}
            >
              About Us
            </Button>
            <Button
              style={{ transition: 'all 0.3s ease-in-out' }}
              className="border border-white text-white bg-blue-300 hover:bg-red-300 hover:text-white"
              onClick={() => scrollToSection("hero-section")}
            >
              Start Saving Now
            </Button>
            <Button
              style={{ transition: 'all 0.3s ease-in-out' }}
              className="border border-white text-white bg-blue-300 hover:bg-red-300 hover:text-white"
              onClick={() => scrollToSection("user-reviews")}
            >
              User Reviews
            </Button>
            <Button
              style={{ transition: 'all 0.3s ease-in-out' }}
              className="border border-white text-white bg-blue-300 hover:bg-red-300 hover:text-white"
              onClick={() => scrollToSection("contact-section")}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </nav>
      {/* HERO SECTION */}
      <div id="hero-section" className="overflow-hidden">
        <div className="bg-[url('/assets/images/AI_BACKGROUND.jpg')] bg-cover bg-center h-screen w-full bg-opacity-50">
        <h1 className="text-center text-6xl md:text-8xl lg:text-9xl font-bold leading-[1.1] pt-50 text-black ai-glow">
              Your AI Advocate <br /> for Lower Medical Bills
          </h1>
          <p className="text-center italic text-2xl text-gray-600 font-[Cormorant Garamond] my-6">
              Heal with care, pay what's fair!
            </p>
            <div className="flex justify-center">
            <h1 className="text-white text-4xl flex justify-center items-center h-full"></h1>
              <Button
                style={{ transition: 'all 0.3s ease-in-out' }}
                className="border border-white text-white bg-blue-300 hover:bg-red-300 hover:text-white"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      
      {/* FEATURES SECTION */}
      <div className="px-6">
        <div className="mx-auto max-w-7xl bg-[radial-gradient(circle,_#ebf8ff_0%,_#ffffff_100%)] rounded-lg p-8 my-8">
          <div id="features-section" className="scroll-mt-32">
            <div className="flex flex-col md:flex-row items-center mb-12">
              <h2 className="text-3xl font-bold text-center w-full">
                Why Choose Our Platform?
              </h2>
            </div>
            <div className="space-y-16">
              {/* Feature Cards */}
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/3 md:pr-8 mb-6 md:mb-0">
                  <HoverCard
                    title="The Burden of Medical Debt"
                    description={`"Approximately 14 million people (6% of adults) in the U.S. owe over $1,000 in medical debt and about 3 million people (1% of adults) owe medical debt of more than $10,000.” – ILR, Cornell University`}
                    imageSrc="/assets/images/Card1.png"
                  />
                </div>
                <div className="md:w-1/3" />
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 hidden md:block" />
                <div className="md:w-2/3 md:pl-8">
                  <HoverCard
                    title="The Medical Debt Crisis"
                    description={`"100 million Americans owe $220 billion in medical debt.” – Consumer Financial Protection Bureau`}
                    imageSrc="/assets/images/Card2.png"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/3 md:pr-8 mb-6 md:mb-0">
                  <HoverCard
                    title="The Cost of Overcharging"
                    description={`"The 100 most expensive U.S. hospitals charge from $1,129 to $1,808 for every $100 of their costs. Nationally, U.S. hospitals average $417 for every $100 of their costs, a markup that has more than doubled over the past 20 years.” – National Nurses United`}
                    imageSrc="/assets/images/Card3.png"
                  />
                </div>
                <div className="md:w-1/3" />
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 hidden md:block" />
                <div className="md:w-2/3 md:pl-8">
                  <HoverCard
                    title="Introducing ClaimCure"
                    description="Understanding your struggle, with the help of AI, ClaimCure is here to ensure fairness and reduce the burden of medical debt."
                    imageSrc="/assets/images/Card4.png"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/3 md:pr-8 mb-6 md:mb-0">
                  <HoverCard
                    title="How ClaimCure Operates"
                    description="Our smart technology analyzes your charges, identifies potential overbilling, generates and sends personalized dispute emails to hospitals on your behalf—helping you challenge excessive charges and secure fairer billing."
                    imageSrc="/assets/images/Card5.png"
                  />
                </div>
                <div className="md:w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* USER REVIEWS SECTION */}
      <div className="px-6">
        <div className="mx-auto max-w-7xl bg-[radial-gradient(circle,_#ebf8ff_0%,_#ffffff_100%)] rounded-lg p-8 my-8">
          <div id="user-reviews">
            <UserReviewsSection />
          </div>
        </div>
      </div>
      
      {/* CONTACT & RETURN TO TOP */}
      <div
        id="contact-section"
        className="absolute bottom-2 left-4 text-sm text-gray-700"
      >
        Contact us:{" "}
        <a href="mailto:claimcure@gmail.com" className="underline">
          claimcure@gmail.com
        </a>
      </div>
      <div className="absolute bottom-2 right-4">
        <Button
          style={{ transition: 'all 0.3s ease-in-out' }}
          className="border border-white text-white bg-blue-300 hover:bg-red-300 hover:text-white"
          onClick={handleScrollToTop}
        >
          Return to Top
        </Button>
      </div>
    </div>
  )
}

/* HoverCard Component remains unchanged */
interface HoverCardProps {
  title: string
  description: string
  imageSrc: string
}

const HoverCard: React.FC<HoverCardProps> = ({ title, description, imageSrc }) => {
  return (
    <div className="relative group overflow-hidden bg-white rounded-lg shadow-lg transition-all">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className="text-gray-700">{description}</p>
      </div>
      <div className="transition-all duration-1500 ease-in-out max-h-0 group-hover:max-h-[600px] overflow-hidden">
        <img src={imageSrc} alt={title} className="w-full h-auto object-cover" />
      </div>
    </div>
  )
}

export default LandingPage
