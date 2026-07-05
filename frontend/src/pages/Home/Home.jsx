import Hero from "../../components/home/Hero/Hero";
import ApiSection from "../../components/home/ApiSection/ApiSection";
import FeaturedSection from "../../components/home/FeaturedSection/FeaturedSection";
import CTASection from "../../components/home/CTASection/CTASection";

function Home() {
  return (
    <>
      <Hero />
      <ApiSection />
      <FeaturedSection />
      <CTASection />
    </>
  );
}

export default Home;