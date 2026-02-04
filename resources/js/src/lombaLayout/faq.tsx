import { useKompetisi } from "../context/KompetisiContext";
import FaqCard from "../components/faqCard";

const FAQ = () => {
  const { kompetisiDetail } = useKompetisi();

  const templateType = kompetisiDetail?.template_type || 'default';
  const isModern = templateType === 'modern' || templateType === 'template_b';

  const theme = {
    bg: isModern ? "bg-[#0a0a0a]" : "bg-gradient-to-br from-white via-yellow/[0.01] to-white",
    heroBg: isModern ? "bg-[#0a0a0a]" : "bg-gradient-to-br from-white via-red/[0.02] to-white",
    sectionBg: isModern ? "bg-[#0a0a0a]" : "bg-gradient-to-br from-white via-yellow/[0.01] to-white",
    cardContainer: isModern ? "bg-[#111] border-t-2 border-gray-800" : "bg-white/40 border-t-2 border-yellow/60",
    textTitle: isModern ? "from-white via-gray-200 to-gray-400" : "from-red via-red/90 to-red/80",
    textSubtitle: isModern ? "from-red-600 via-red-500 to-red-400" : "from-red/80 via-red/90 to-red",
    textBody: isModern ? "text-gray-400" : "text-black/80",
    borderAccent: isModern ? "border-red-600" : "border-red",
    lineGradient: isModern ? "from-red-600 to-red-900" : "from-red to-red/60",
    divider: isModern ? "border-gray-800" : "border-yellow/20"
  };

  const sections = (() => {
    const data = kompetisiDetail?.faq_data as any;
    if (Array.isArray(data) && data.length > 0) return data;
    if (typeof data === 'string' && data.trim().length > 0) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse FAQ data:", e);
      }
    }
    return [];
  })();

  return (
    <div className={`min-h-screen w-full ${theme.bg} pt-10 lg:pt-0`}>
      {/* Enhanced Hero Section */}
      <section className={`relative w-full flex flex-col justify-center items-center ${theme.heroBg} overflow-hidden pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-6 sm:pb-8 md:pb-12 lg:pb-16`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: isModern ? '' : `
                            linear-gradient(rgba(220,38,38,.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(220,38,38,.3) 1px, transparent 1px)
                        `,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative z-10 w-full max-w-7xl">
          <div className="text-center space-y-4 sm:space-y-6 md:space-y-8">
            {/* Section Label */}
            <div className="hidden lg:inline-block group">
              <span className={`${isModern ? "text-red-500 border-red-500" : "text-red border-red"} font-plex font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] border-l-4 pl-3 sm:pl-4 md:pl-6 relative`}>
                Pusat Bantuan
                <div className={`absolute -left-1 top-0 bottom-0 w-1 ${isModern ? "bg-red-500/20" : "bg-red/20"} group-hover:bg-opacity-40 transition-colors duration-300`}></div>
              </span>
            </div>

            {/* Main Title */}
            <div className="relative">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bebas leading-[0.85] tracking-wide">
                <span className={`bg-gradient-to-r ${theme.textTitle} bg-clip-text text-transparent`}>
                  Frequently Asked
                </span>
                <span className={`block bg-gradient-to-r ${theme.textSubtitle} bg-clip-text text-transparent`}>
                  Questions
                </span>
              </h1>
              <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 md:w-20 h-0.5 sm:h-1 bg-gradient-to-r ${theme.lineGradient} rounded-full`}></div>
            </div>

            {/* Description */}
            <p className={`text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-plex ${theme.textBody} max-w-4xl mx-auto leading-relaxed font-light px-2 sm:px-4`}>
              Temukan jawaban untuk pertanyaan yang sering diajukan seputar{" "}
              {kompetisiDetail?.nama_event || "Kompetisi"}. Jika
              tidak menemukan jawaban yang Anda cari, silakan hubungi tim kami.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      {sections.map((section: any, sectionIndex: number) => (
        <section
          key={sectionIndex}
          className={`relative w-full flex flex-col justify-center items-center ${theme.sectionBg} overflow-hidden py-6 sm:py-8 md:py-12 lg:py-16`}
        >
          {/* Alternating background patterns */}
          <div className="absolute inset-0 opacity-[0.01]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: isModern ? '' : `
                                linear-gradient(rgba(251,191,36,.3) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(251,191,36,.3) 1px, transparent 1px)
                            `,
                backgroundSize:
                  sectionIndex % 2 === 0 ? "50px 50px" : "30px 30px",
              }}
            ></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative z-10 w-full max-w-7xl">
            <div className="max-w-full mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-16 items-start">
                {/* Section Info */}
                <div className="lg:col-span-2 xl:col-span-2 space-y-3 sm:space-y-4 md:space-y-6 text-center lg:text-left">
                  {/* Section Title */}
                  <div className="relative">
                    <h2 className="text-3xl sm:text-3xl md:text-5xl lg:text-5xl xl:text-6xl font-bebas leading-[0.9] tracking-wide">
                      <span className={`bg-gradient-to-r ${theme.textTitle} bg-clip-text text-transparent`}>
                        {(section.title || "").split(" ")[0]}
                      </span>
                      {(section.title || "").split(" ").slice(1).length > 0 && (
                        <span className={`block bg-gradient-to-r ${theme.textSubtitle} bg-clip-text text-transparent`}>
                          {section.title.split(" ").slice(1).join(" ")}
                        </span>
                      )}
                    </h2>
                    <div className="absolute -bottom-1 left-1/2 lg:left-0 transform -translate-x-1/2 lg:transform-none w-10 sm:w-12 md:w-16 h-0.5 bg-gradient-to-r from-red to-yellow rounded-full"></div>
                  </div>

                  {/* Section Description */}
                  <p className={`text-xs sm:text-sm md:text-base font-plex ${theme.textBody} leading-relaxed font-light max-w-md mx-auto lg:mx-0`}>
                    {section.description}
                  </p>
                </div>

                {/* FAQ Cards - Wider Span */}
                <div className="lg:col-span-3 xl:col-span-3">
                  <div className={`w-full flex flex-col ${theme.cardContainer} backdrop-blur-sm transition-all duration-500`}>
                    {section.questions.map((faq, questionIndex) => (
                      <div
                        key={questionIndex}
                        className={`border-b ${theme.divider} last:border-b-0 hover:bg-yellow/[0.02] transition-all duration-300`}
                      >
                        <FaqCard question={faq.question} answer={faq.answer} isModern={isModern} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Bottom spacing for mobile navigation or footer */}
      <div className="h-16 sm:h-20 md:h-0"></div>
    </div>
  );
};

export default FAQ;
