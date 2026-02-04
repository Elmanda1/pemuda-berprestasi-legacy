import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import CompCard from "./compCard";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useKompetisi } from "../context/KompetisiContext";

const OngoingComp = () => {
  const { kompetisiDetail, kompetisiList, fetchKompetisiList, loadingKompetisi } = useKompetisi();
  const [currentIndex, setCurrentIndex] = useState(0);

  const templateType = kompetisiDetail?.template_type || 'default';
  const isModern = templateType === 'modern' || templateType === 'template_b';

  useEffect(() => {
    if (kompetisiList.length === 0) {
      fetchKompetisiList();
    }
  }, []);

  const theme = {
    bg: isModern ? "bg-black" : "bg-gradient-to-br from-white via-red/[0.02] to-white",
    textMain: isModern ? "text-white" : "text-black/80",
    textSec: isModern ? "text-gray-400" : "text-black/70",
    border: isModern ? "border-red-900/30" : "border-red/10",
    cardBg: isModern ? "bg-[#111] border-red-900/20" : "bg-white/90 border-red/10",
  };

  const handlePrev = () => {
    if (kompetisiList.length <= 1) {
      toast.error("Hanya ada satu kompetisi untuk sekarang");
      return;
    }
    setCurrentIndex((prev) => (prev === 0 ? kompetisiList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (kompetisiList.length <= 1) {
      toast.error("Hanya ada satu kompetisi untuk sekarang");
      return;
    }
    setCurrentIndex((prev) => (prev === kompetisiList.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className={`relative w-full overflow-hidden py-8 md:py-12 lg:py-16 ${theme.bg}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Enhanced Header Section */}
        <div className="text-left mb-12 md:mb-16 lg:mb-20 max-w-4xl">
          <div className="inline-block group mb-4 md:mb-6">
            <span className="text-red font-plex font-semibold text-sm uppercase tracking-[0.2em] border-l-4 border-red pl-4 md:pl-6 relative">
              Kompetisi Terkini
              <div className="absolute -left-1 top-0 bottom-0 w-1 bg-red/20 group-hover:bg-red/40 transition-colors duration-300"></div>
            </span>
          </div>

          <div className="relative mb-4 md:mb-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bebas leading-[0.85] tracking-wide">
              <span className="bg-gradient-to-r from-red via-red/90 to-red/80 bg-clip-text text-transparent">
                Our
              </span>
              <span className="block bg-gradient-to-r from-red/90 via-red to-red/90 bg-clip-text text-transparent">
                Competitions
              </span>
            </h2>
            <div className="absolute -bottom-2 left-0 w-16 md:w-24 h-1 bg-gradient-to-r from-red to-red/60 rounded-full"></div>
          </div>

          <p className={`text-base md:text-lg lg:text-xl xl:text-2xl font-plex leading-relaxed font-light max-w-2xl ${theme.textSec}`}>
            Jadilah bagian dari tantangan taekwondo terbaik di arena digital global
          </p>
        </div>

        {/* Enhanced Competition Card Section */}
        <div className="mb-12 md:mb-16 lg:mb-20">
          {loadingKompetisi && kompetisiList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-red animate-spin mb-4" />
              <p className="text-red font-plex font-medium">Memuat kompetisi...</p>
            </div>
          ) : (
            <>
              {/* Desktop Layout */}
              <div className="hidden lg:flex items-center justify-center gap-8 xl:gap-12 w-full">
                <div className="flex-shrink-0">
                  <button
                    onClick={handlePrev}
                    className={`group relative p-4 xl:p-6 rounded-2xl xl:rounded-3xl backdrop-blur-md border hover:border-red/20 hover:bg-red transition-all duration-500 hover:shadow-2xl hover:shadow-red/25 ${theme.cardBg}`}
                  >
                    <ChevronLeft
                      size={28}
                      className="xl:w-8 xl:h-8 text-red group-hover:text-white transition-all duration-300"
                    />
                  </button>
                </div>

                <div className="flex-1 max-w-6xl flex justify-center transition-all duration-500 transform">
                  <CompCard kompetisi={kompetisiList[currentIndex]} />
                </div>

                <div className="flex-shrink-0">
                  <button
                    onClick={handleNext}
                    className={`group relative p-4 xl:p-6 rounded-2xl xl:rounded-3xl backdrop-blur-md border hover:border-red/20 hover:bg-red transition-all duration-500 hover:shadow-2xl hover:shadow-red/25 ${theme.cardBg}`}
                  >
                    <ChevronRight
                      size={28}
                      className="xl:w-8 xl:h-8 text-red group-hover:text-white transition-all duration-300"
                    />
                  </button>
                </div>
              </div>

              {/* Enhanced Mobile Layout */}
              <div className="lg:hidden flex flex-col items-center">
                <div className="w-full max-w-4xl mb-6 flex justify-center">
                  <div className="border-2 border-red/20 rounded-xl md:rounded-2xl p-1 bg-gradient-to-r from-red/5 to-red/10 shadow-lg w-full">
                    <CompCard kompetisi={kompetisiList[currentIndex]} />
                  </div>
                </div>

                {kompetisiList.length > 1 && (
                  <div className="flex justify-center items-center gap-3">
                    {kompetisiList.map((_, idx) => (
                      <div
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`transition-all duration-300 cursor-pointer rounded-full ${currentIndex === idx
                            ? "w-6 md:w-8 h-2.5 md:h-3 bg-red shadow-sm"
                            : "w-2.5 h-2.5 md:w-3 md:h-3 bg-red/20 hover:bg-red/40"
                          }`}
                      ></div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

      </div>
    </section>
  );
};

export default OngoingComp;