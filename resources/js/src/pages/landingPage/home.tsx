import Hero from '../../components/hero'
import About from '../../components/about'
import Features from '../../components/Features'
import OngoingComp from '../../components/ongoingComp'

const Home = () => {
  return (
    <main className="min-h-screen w-full bg-white">
      <Hero />
      <About />
      <Features />
      <OngoingComp />
    </main>
  );
};

export default Home;