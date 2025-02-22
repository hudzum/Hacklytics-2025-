import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ArrowRight } from 'lucide-react';

interface LandingPageProps {
  setIsApp: (value: boolean) => void;
}

const PeopleSavedCard: React.FC = () => {
  const [savedAmount, setSavedAmount] = React.useState<number>(0)

  // Example function to demonstrate increment
  const handleIncrement = () => {
    setSavedAmount((prev) => prev + 1000)
  }

  return (
    <Card className="mx-auto max-w-3xl my-12 p-8 shadow-xl ">
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
        <Button variant="outline" size="lg" className="text-xl px-6 py-3" onClick={handleIncrement}>
          Add $1,000 (Demo)
        </Button>
      </CardContent>
    </Card>
  )  
};

const LandingPage: React.FC<LandingPageProps> = ({ setIsApp }) => {
  const handleGetStarted = (): void => {
    setIsApp(true);
  };

  // Scroll to the features section
  const handleAboutUs = () => {
    const featuresSection = document.getElementById("features-section");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full min-h-screen relative">
      {/* 1. Logo & "About Us" Button Container */}
      <div className="absolute top-4 left-4 flex items-center gap-4">
        {/* Scaled Logo (3× larger) */}
        <img 
          src="/src/assets/images/ChargeZero.png"
          alt="Logo"
          className="h-36 w-auto"
        />

        {/* White "About Us" Button */}
        <Button 
          variant="outline" 
          onClick={handleAboutUs} 
          className="text-white border-white"
        >
          About Us
        </Button>
      </div>

      {/* -- People Saved Card (Shadcn UI) -- */}
      <div className="py-50 px-6 text-center">
        <PeopleSavedCard />
      </div>

      {/* Hero Section */}
      <div className="py-100 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight mb-8">
            Build something amazing with our platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create, deploy, and scale your applications with our powerful tools and intuitive interface.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={handleGetStarted}>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      {/* 7. Darker (But Still Light) Blue Background */}
      <div
        id="features-section"
        className="py-24 px-6 w-full"
      >
        <div className="max-w-6xl mx-auto">
          {/* 1. Logo scaled 3× (h-36) + 2. Title Centered (text-center) */}
          <div className="flex flex-col md:flex-row items-center mb-12">
            <h2 className="text-3xl font-bold text-center w-full">
              Why Choose Our Platform?
            </h2>
          </div>

          {/* Features List */}
          <div className="space-y-16">
            {/* Card 1 (Left-aligned) */}
            <div className="flex flex-col md:flex-row">
              {/* 3. Make card wider (md:w-2/3 instead of md:w-1/2) */}
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

      {/* CTA Section */}
      <div className="py-24 px-6 w-full">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of developers building amazing applications.
          </p>
          <Button size="lg" onClick={handleGetStarted}>
            Start Building Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface HoverCardProps {
  title: string;
  description: string;
  imageSrc: string;
}

const HoverCard: React.FC<HoverCardProps> = ({ title, description, imageSrc }) =>  {
  return (
    <div className="relative group overflow-hidden bg-blue-100 rounded-lg shadow-lg transition-all">
      {/* Card Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className="text-gray-700">{description}</p>
      </div>

      {/* Hidden Image (slides down on hover) */}
      <div className="transition-all duration-300 ease-in-out max-h-0 group-hover:max-h-[600px] overflow-hidden">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  );
};

export default LandingPage;
