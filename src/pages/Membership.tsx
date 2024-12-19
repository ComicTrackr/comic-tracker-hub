import { useNavigate } from "react-router-dom";
import PricingCard from "@/components/membership/PricingCard";
import FeaturePreview from "@/components/membership/FeaturePreview";

const Membership = () => {
  const navigate = useNavigate();

  const handlePlanSelection = (planType: 'monthly' | 'lifetime') => {
    navigate(`/login?plan=${planType}`);
  };

  const features = {
    monthly: [
      "Unlimited Comic Tracking",
      "Real-time Value Updates",
      "AI-Powered Analytics"
    ],
    lifetime: [
      "Everything in Monthly Plan",
      "No Monthly Fees Ever"
    ]
  };

  const previews = [
    {
      imageSrc: "/lovable-uploads/e524334c-90d2-45ba-81cc-ab77d0c3402b.png",
      title: "Smart Upload",
      description: "Easily upload and analyze your comic covers with our AI-powered system."
    },
    {
      imageSrc: "/lovable-uploads/2ec5b995-fb26-4178-80cf-13c5181d2b7e.png",
      title: "Value Tracking",
      description: "Track your collection's value with real-time market data."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-orange-800 mb-4">
          ComicTrackr: The AI-Powered Comic Book Tracker
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Effortlessly manage your comic book collection with ComicTrackr, your ultimate companion for tracking, organizing, and staying updated on the real-time retail value of your comics.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {previews.map((preview, index) => (
          <FeaturePreview key={index} {...preview} />
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <PricingCard
          title="Monthly Plan"
          price="4.99"
          interval="/month"
          features={features.monthly}
          onSelect={() => handlePlanSelection('monthly')}
        />
        <PricingCard
          title="Lifetime Access"
          price="14.99"
          interval="one-time"
          features={features.lifetime}
          onSelect={() => handlePlanSelection('lifetime')}
          isHighlighted
        />
      </div>
    </div>
  );
};

export default Membership;