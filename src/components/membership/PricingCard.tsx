import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PricingCardProps {
  title: string;
  price: string;
  interval: string;
  features: string[];
  onSelect: () => void;
  isHighlighted?: boolean;
}

const PricingCard = ({
  title,
  price,
  interval,
  features,
  onSelect,
  isHighlighted = false,
}: PricingCardProps) => {
  return (
    <Card className={`p-6 flex flex-col ${isHighlighted ? 'border-orange-800 border-2' : ''}`}>
      <h3 className="text-2xl font-bold text-orange-800 mb-4">{title}</h3>
      <div className="text-3xl font-bold mb-6">
        ${price}<span className="text-lg text-muted-foreground"> {interval}</span>
      </div>
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <Button onClick={onSelect} className="w-full">
        {title === "Monthly Plan" ? "Start Monthly Plan" : "Get Lifetime Access"}
      </Button>
    </Card>
  );
};

export default PricingCard;