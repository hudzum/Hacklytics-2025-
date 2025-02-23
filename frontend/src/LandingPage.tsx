import React from 'react'
import { Dispatch, SetStateAction } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { UserReviewsSection } from './UserReviewsSection'


const PeopleSavedCard: React.FC = () => {
  const [savedAmount, setSavedAmount] = React.useState<number>(0)

  // Example function to demonstrate increment
  const handleIncrement = () => {
    setSavedAmount((prev) => prev + 1000)
  }

  return (
    <Card className="mx-auto max-w-3xl my-12 p-8 shadow-xl">
      <CardHeader className="py-10">
        <CardDescription className="text-center text-2xl font-semibold">
          ChargeZero has helped save a total of
        </CardDescription>
        <CardTitle className="text-center text-7xl font-extrabold">
          ${savedAmount.toLocaleString()}
        </CardTitle>
        <CardDescription className="text-center text-2xl font-semibold">
          on medical bills this year.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button 
          size="lg" 
          style={{ transition: 'all 0.3s ease-in-out' }}
          className="border border-white text-black bg-transparent hover:bg-black hover:text-white"
          onClick={handleIncrement}
        >
          Add $1,000 (Demo)
        </Button>
      </CardContent>
     
      
    </Card>
  )
}

const LandingPage = ({ setIsApp }:{ setIsApp: Dispatch<SetStateAction<boolean>>;
}) => {
  // Scroll to top on "Start Building Now" demo (or actual usage)
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
    <div className="w-full min-h-screen relative bg-white">
      {/* 1. Fixed Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <img
              src="/src/assets/images/ClaimCure.png"
              alt="Logo"
              className="h-24 w-auto"
            />
              <span className="claimcure text-3xl font-bold">
                <span className="claim">Claim</span>
                <span className="cure">Cure</span>
              </span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {/* About Us -> features-section */}
            <Button
              style={{ transition: 'all 0.3s ease-in-out' }}
              className="border border-white text-black bg-transparent hover:bg-black hover:text-white"
              onClick={() => scrollToSection("features-section")}
            >
              About Us
            </Button>
            {/* Hero Section -> hero-section */}
            <Button
              style={{ transition: 'all 0.3s ease-in-out' }}
              className="border border-white text-black bg-transparent hover:bg-black hover:text-white"
              onClick={() => scrollToSection("hero-section")}
            >
              Start Saving Now
            </Button>
            {/* User Reviews -> user-reviews */}
            <Button
              style={{ transition: 'all 0.3s ease-in-out' }}
              className="border border-white text-black bg-transparent hover:bg-black hover:text-white"
              onClick={() => scrollToSection("user-reviews")}
            >
              User Reviews
            </Button>
            {/* Contact -> contact-section */}
            <Button
              style={{ transition: 'all 0.3s ease-in-out' }}
              className="border border-white text-black bg-transparent hover:bg-black hover:text-white"
              onClick={() => scrollToSection("contact-section")}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </nav>
     
      {/* 2. Add margin-top so content isn't hidden behind the nav */}
      <div className="mt-[120px]">

        {/* -- People Saved Card -- */}
        <div className="py-20 px-6 text-center scroll-mt-32">
          <PeopleSavedCard />
        </div>
        <Button onClick= {() =>
        handleGetStarted()
      }>Get Started</Button>
        {/* Hero Section */}
        <div id="hero-section" className="py-20 px-6 text-center scroll-mt-32">
          {/* Upload Medical Bills Card */}
          <Card className="mx-auto mt-12 max-w-2xl bg-white shadow-lg p-8">
            <CardHeader>
              <CardTitle className="text-3xl font-extrabold">
                Upload Your Medical Bills
              </CardTitle>
              <CardDescription className="text-xl text-gray-700">
                We'll analyze them to help identify overcharges and secure fair billing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-600 mb-6">
                Drag and drop your file here or click below to browse.
              </p>
              <Button
                variant="outline"
                size="lg"
                style={{ transition: 'all 0.3s ease-in-out' }}
                className="border border-white text-black bg-transparent hover:bg-black hover:text-white"
              >
                Choose File
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div id="features-section" className="py-12 px-6 w-full scroll-mt-32">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center mb-12">
              <h2 className="text-3xl font-bold text-center w-full">
                Why Choose Our Platform?
              </h2>
            </div>

            {/* Features List */}
            <div className="space-y-16">
              {/* Card 1 (Left-aligned) */}
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/3 md:pr-8 mb-6 md:mb-0">
                  <HoverCard
                    title="The Burden of Medical Debt"
                    description={`"Approximately 14 million people (6% of adults) in the U.S. owe over $1,000 in medical debt and about 3 million people (1% of adults) owe medical debt of more than $10,000.” – ILR, Cornell University`}
                    imageSrc="/src/assets/images/Card1.png"
                  />
                </div>
                <div className="md:w-1/3" />
              </div>

              {/* Card 2 (Right-aligned) */}
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 hidden md:block" />
                <div className="md:w-2/3 md:pl-8">
                  <HoverCard
                    title="The Medical Debt Crisis"
                    description={`"100 million Americans owe $220 billion in medical debt.” – Consumer Financial Protection Bureau`}
                    imageSrc="/src/assets/images/Card2.png"
                  />
                </div>
              </div>

              {/* Card 3 (Left-aligned) */}
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/3 md:pr-8 mb-6 md:mb-0">
                  <HoverCard
                    title="The Cost of Overcharging"
                    description={`"The 100 most expensive U.S. hospitals charge from $1,129 to $1,808 for every $100 of their costs. Nationally, U.S. hospitals average $417 for every $100 of their costs, a markup that has more than doubled over the past 20 years.” – National Nurses United`}
                    imageSrc="/src/assets/images/Card3.png"
                  />
                </div>
                <div className="md:w-1/3" />
              </div>

              {/* Card 4 (Right-aligned) */}
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 hidden md:block" />
                <div className="md:w-2/3 md:pl-8">
                  <HoverCard
                    title="Introducting ChargeZero"
                    description="Understanding your struggle, with the help of AI, ChargeZero is here to ensure fairness and reduce the burden of medical debt."
                    imageSrc="/src/images/feature4.jpg"
                  />
                </div>
              </div>

              {/* Card 5 (Left-aligned) */}
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/3 md:pr-8 mb-6 md:mb-0">
                  <HoverCard
                    title="How ChargeZero Operate"
                    description="Our smart technology analyzes your charges, identifies potential overbilling, generates and sends personalized dispute emails to hospitals on your behalf—helping you challenge excessive charges and secure fairer billing."
                    imageSrc="/src/images/feature5.jpg"
                  />
                </div>
                <div className="md:w-1/3" />
              </div>
            </div>
          </div>
        </div>

        {/* User Reviews Section */}
        <UserReviewsSection />
      </div>

      {/* Contact Section and "Return to Top" Button */}
      {/* Contact bottom-left */}
      <div
        id="contact-section"
        className="absolute bottom-4 left-4 text-sm text-gray-700"
      >
        Contact us:{" "}
        <a href="mailto:chargezero@gmail.com" className="underline">
          chargezero@gmail.com
        </a>
      </div>

      {/* Return to Top bottom-right */}
      <div className="absolute bottom-4 right-4">
        <Button
          style={{ transition: 'all 0.3s ease-in-out' }}
          className="border border-white text-black bg-transparent hover:bg-black hover:text-white"
          onClick={handleScrollToTop}
        >
          Return to Top
        </Button>
      </div>
    </div>
  )
}

/* HoverCard remains the same */
interface HoverCardProps {
  title: string
  description: string
  imageSrc: string
}

const HoverCard: React.FC<HoverCardProps> = ({
  title,
  description,
  imageSrc,
}) => {
  return (
    <div className="relative group overflow-hidden bg-blue-100 rounded-lg shadow-lg transition-all">
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
