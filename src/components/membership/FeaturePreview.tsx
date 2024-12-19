interface FeaturePreviewProps {
  imageSrc: string;
  title: string;
  description: string;
}

const FeaturePreview = ({ imageSrc, title, description }: FeaturePreviewProps) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-xl h-full">
      <div className="aspect-video">
        <img 
          src={imageSrc}
          alt={`${title} Preview`} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="bg-card p-4">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default FeaturePreview;