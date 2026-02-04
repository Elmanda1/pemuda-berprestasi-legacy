import FaqCard from "../components/faqCard";

export default function FaqTemplateDefault({ kompetisiDetail, sections, primaryColor }: any) {
    const theme = {
        bg: "bg-gradient-to-br from-white via-yellow/[0.01] to-white",
        heroBg: "bg-gradient-to-br from-white via-red/[0.02] to-white",
        sectionBg: "bg-gradient-to-br from-white via-yellow/[0.01] to-white",
        cardContainer: "bg-white/40 border-t-2 border-yellow/60",
        textTitleStyle: { backgroundImage: `linear-gradient(to right, ${primaryColor}, ${primaryColor}e6, ${primaryColor}cc)` },
        textSubtitleStyle: { backgroundImage: `linear-gradient(to right, ${primaryColor}, ${primaryColor}e6, ${primaryColor}cc)` },
        textBody: "text-black/80",
        lineGradientStyle: { backgroundImage: `linear-gradient(to right, ${primaryColor}, ${primaryColor}99)` },
        divider: "border-yellow/20"
    };

    return (
        <div className={`min-h-screen w-full ${theme.bg} pt-10 lg:pt-0`}>
            <section className={`relative w-full flex flex-col justify-center items-center ${theme.heroBg} overflow-hidden pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-6 sm:pb-8 md:pb-12 lg:pb-16`}>
                <div className="absolute inset-0 opacity-[0.02]">
                    <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(rgba(220,38,38,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,.3) 1px, transparent 1px)`, backgroundSize: "40px 40px" }}></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10 w-full max-w-7xl">
                    <div className="text-center space-y-4 sm:space-y-6 md:space-y-8">
                        <div className="hidden lg:inline-block group">
                            <span className="text-red border-red font-plex font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] border-l-4 pl-3 sm:pl-4 md:pl-6 relative">
                                Pusat Bantuan
                                <div className="absolute -left-1 top-0 bottom-0 w-1 bg-red/20 group-hover:bg-opacity-40 transition-colors duration-300"></div>
                            </span>
                        </div>

                        <div className="relative">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bebas leading-[0.85] tracking-wide">
                                <span className="bg-clip-text text-transparent" style={theme.textTitleStyle}>Frequently Asked</span>
                                <span className="block bg-clip-text text-transparent" style={theme.textSubtitleStyle}>Questions</span>
                            </h1>
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 sm:w-16 md:w-20 h-0.5 sm:h-1 rounded-full" style={theme.lineGradientStyle}></div>
                        </div>

                        <p className={`text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-plex ${theme.textBody} max-w-4xl mx-auto leading-relaxed font-light px-2 sm:px-4`}>
                            Temukan jawaban untuk pertanyaan yang sering diajukan seputar {kompetisiDetail?.nama_event || "Kompetisi"}.
                        </p>
                    </div>
                </div>
            </section>

            {sections.map((section: any, sectionIndex: number) => (
                <section key={sectionIndex} className={`relative w-full flex flex-col justify-center items-center ${theme.sectionBg} overflow-hidden py-6 sm:py-8 md:py-12 lg:py-16`}>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10 w-full max-w-7xl">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                            <div className="lg:col-span-2 space-y-4 text-center lg:text-left">
                                <div className="relative">
                                    <h2 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-bebas leading-[0.9] tracking-wide">
                                        <span className="bg-clip-text text-transparent" style={theme.textTitleStyle}>{(section.title || "").split(" ")[0]}</span>
                                        {(section.title || "").split(" ").slice(1).length > 0 && (
                                            <span className="block bg-clip-text text-transparent" style={theme.textSubtitleStyle}>{section.title.split(" ").slice(1).join(" ")}</span>
                                        )}
                                    </h2>
                                    <div className="absolute -bottom-1 left-1/2 lg:left-0 transform -translate-x-1/2 lg:transform-none w-10 sm:w-12 h-0.5 rounded-full" style={theme.lineGradientStyle}></div>
                                </div>
                                <p className={`text-xs sm:text-sm md:text-base font-plex ${theme.textBody} leading-relaxed font-light max-w-md mx-auto lg:mx-0`}>{section.description}</p>
                            </div>
                            <div className="lg:col-span-3">
                                <div className={`w-full flex flex-col ${theme.cardContainer} backdrop-blur-sm`}>
                                    {section.questions.map((faq: any, questionIndex: number) => (
                                        <div key={questionIndex} className={`border-b ${theme.divider} last:border-b-0 hover:bg-yellow/[0.02] transition-all duration-300`}>
                                            <FaqCard question={faq.question} answer={faq.answer} primaryColor={primaryColor} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ))}
            <div className="h-16 sm:h-20 md:h-0"></div>
        </div>
    );
}
