import CompCard from "../../components/compCard";
import { useKompetisi } from "../../context/KompetisiContext";

const Event = () => {
  const { kompetisiDetail } = useKompetisi();
  const templateType = kompetisiDetail?.template_type || 'default';
  const isModern = templateType === 'modern' || templateType === 'template_b' || templateType === 'template_c';

  const theme = {
    bg: isModern ? '#0a0a0a' : '#FFF5F7',
    cardBg: isModern ? '#111111' : '#FFFFFF',
    textPrimary: isModern ? '#FFFFFF' : '#1F2937',
    textSecondary: isModern ? '#A1A1AA' : '#6B7280',
    primary: kompetisiDetail?.primary_color || '#DC2626',
    border: isModern ? 'rgba(255,255,255,0.1)' : 'rgba(220, 38, 38, 0.1)',
    gradient: isModern ? 'linear-gradient(135deg, #111111 0%, #0a0a0a 100%)' : 'linear-gradient(to bottom right, #ffffff, #FFF5F7, #FFF0F0)'
  };

  return (
    <section className="relative min-h-screen w-full py-20 md:py-32 lg:py-40 overflow-hidden transition-colors duration-300"
      style={{ background: theme.gradient }}>
      {/* Subtle Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-32 md:w-48 lg:w-64 h-32 md:h-48 lg:h-64 border rounded-full animate-pulse opacity-30" style={{ borderColor: theme.border }}></div>
        <div className="absolute bottom-1/4 left-1/5 w-24 md:w-36 lg:w-48 h-24 md:h-36 lg:h-48 border rounded-full animate-pulse opacity-25 animation-delay-1000" style={{ borderColor: theme.border }}></div>
        <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 rounded-full animate-bounce opacity-50" style={{ backgroundColor: theme.primary }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-1 h-1 rounded-full animate-bounce animation-delay-700" style={{ backgroundColor: theme.primary }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col justify-center items-center gap-12 md:gap-16 lg:gap-20 max-w-7xl mx-auto">

          {/* Enhanced Header Section */}
          <div className="text-center space-y-4 md:space-y-6">
            {/* Section Label with Animation */}
            <div className="inline-block group mb-4 md:mb-6">
              <span className="font-plex font-semibold text-xs md:text-sm uppercase tracking-[0.25em] border-l-3 md:border-l-4 pl-3 md:pl-4 relative"
                style={{ color: theme.primary, borderColor: theme.primary }}>
                Kompetisi
                <div className="absolute -left-1 top-0 bottom-0 w-0.5 md:w-1 transition-colors duration-300"
                  style={{ backgroundColor: theme.primary + '33' }}></div>
              </span>
            </div>

            {/* Main Title with Gradient */}
            <div className="relative">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-judul font-bebas leading-none tracking-wide"
                style={{ color: theme.primary }}>
                <span className="bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(to right, ${theme.primary}, ${theme.primary}E6)` }}>
                  our competitions
                </span>
              </h1>
              {/* Subtle underline accent */}
              <div className="absolute -bottom-2 md:-bottom-3 left-1/2 transform -translate-x-1/2 w-12 md:w-16 lg:w-20 h-0.5 md:h-1 rounded-full"
                style={{ background: `linear-gradient(to right, transparent, ${theme.primary}, transparent)` }}></div>
            </div>

            {/* Subtitle */}
            <p className="text-sm md:text-base lg:text-lg font-plex max-w-2xl mx-auto leading-relaxed mt-6 md:mt-8"
              style={{ color: theme.textSecondary }}>
              Temukan berbagai kompetisi taekwondo berkualitas internasional yang tersedia untuk menguji kemampuan dan prestasi Anda
            </p>
          </div>

          {/* Enhanced Competition Cards Section */}
          <div className="w-full max-w-6xl mx-auto">
            <div className="relative">
              {/* Decorative elements around cards */}
              <div className="absolute -top-4 -left-4 w-6 h-6 rounded-full blur-sm" style={{ backgroundColor: theme.primary + '1A' }}></div>
              <div className="absolute -bottom-4 -right-4 w-4 h-4 rounded-full blur-sm" style={{ backgroundColor: theme.primary + '26' }}></div>

              <div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
                <CompCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Event;