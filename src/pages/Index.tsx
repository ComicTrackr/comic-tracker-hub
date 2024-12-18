import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SearchBar } from "@/components/SearchBar";
import { UploadButton } from "@/components/UploadButton";
import { PaymentButton } from "@/components/PaymentButton";

const Index = () => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12 space-y-12">
        <Hero />
        
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col items-center space-y-6">
            <UploadButton />
            <p className="text-sm opacity-70">or</p>
            <SearchBar />
          </div>
          
          <div className="text-center space-y-4">
            <div className="text-sm opacity-70">
              Supported formats: JPG, PNG, WEBP • Max file size: 10MB
            </div>
            <PaymentButton />
          </div>
        </div>
      </main>
    </>
  );
};

export default Index;