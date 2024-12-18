import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SearchBar } from "@/components/SearchBar";
import { UploadButton } from "@/components/UploadButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 space-y-12">
        <Hero />
        
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col items-center space-y-6">
            <UploadButton />
            <p className="text-sm opacity-70">or</p>
            <SearchBar />
          </div>
          
          <div className="text-center text-sm opacity-70">
            Supported formats: JPG, PNG, WEBP • Max file size: 10MB
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;