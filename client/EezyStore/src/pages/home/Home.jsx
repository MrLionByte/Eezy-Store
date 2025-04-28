import Features from '../../components/home/Feature';
import Hero from '../../components/home/Hero';
import CTA from '../../components/home/CTA';

const Home = () => {
  return (

      <section className="relative overflow-hidden">
        <Hero />
        <Features />
        <CTA />
      </section>
  );
};

export default Home;