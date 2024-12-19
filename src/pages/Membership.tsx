import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

const Membership = () => {
  const navigate = useNavigate();

  const handlePlanSelection = (planType: 'monthly' | 'lifetime') => {
    navigate(`/login?plan=${planType}`);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-800 mb-4">
            ComicTrackr: The AI-Powered Comic Book Tracker
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Effortlessly manage your comic book collection with ComicTrackr, your ultimate companion for tracking, organizing, and staying updated on the real-time retail value of your comics.
          </p>
        </div>

        {/* App Screenshots */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="rounded-lg overflow-hidden shadow-xl h-full">
            <div className="aspect-video">
              <img 
                src="/lovable-uploads/e524334c-90d2-45ba-81cc-ab77d0c3402b.png"
                alt="Homepage Preview" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-card p-4">
              <h3 className="font-semibold text-lg mb-2">Smart Upload</h3>
              <p className="text-muted-foreground">Easily upload and analyze your comic covers with our AI-powered system.</p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl h-full">
            <div className="aspect-video">
              <img 
                src="/lovable-uploads/2ec5b995-fb26-4178-80cf-13c5181d2b7e.png"
                alt="Dashboard Preview" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-card p-4">
              <h3 className="font-semibold text-lg mb-2">Value Tracking</h3>
              <p className="text-muted-foreground">Track your collection's value with real-time market data.</p>
            </div>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="p-6 flex flex-col">
            <h3 className="text-2xl font-bold text-orange-800 mb-4">Monthly Plan</h3>
            <div className="text-3xl font-bold mb-6">$4.99<span className="text-lg text-muted-foreground">/month</span></div>
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Unlimited Comic Tracking
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Real-time Value Updates
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                AI-Powered Analytics
              </li>
            </ul>
            <Button onClick={() => handlePlanSelection('monthly')} className="w-full">
              Start Monthly Plan
            </Button>
          </Card>

          <Card className="p-6 flex flex-col border-orange-800 border-2">
            <div className="absolute -top-3 right-4 bg-orange-800 text-white px-3 py-1 rounded-full text-sm">
              Best Value
            </div>
            <h3 className="text-2xl font-bold text-orange-800 mb-4">Lifetime Access</h3>
            <div className="text-3xl font-bold mb-6">$14.99<span className="text-lg text-muted-foreground"> one-time</span></div>
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Everything in Monthly Plan
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                No Monthly Fees Ever
              </li>
            </ul>
            <Button onClick={() => handlePlanSelection('lifetime')} className="w-full">
              Get Lifetime Access
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Membership;