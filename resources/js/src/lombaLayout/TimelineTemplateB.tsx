import {
    TimelineCardKiri,
    TimelineCardKanan,
} from "../components/TimelineCard";
import { useNavigate } from "react-router-dom";

export default function TimelineTemplateB({ kompetisiDetail, rawEvents, groupedEvents, primaryColor }: any) {
    const navigate = useNavigate();

    const theme = {
        bg: "bg-[#0a0a0a]",
        textTitleStyle: { backgroundImage: `linear-gradient(to right, #fff, #e5e7eb, #9ca3af)` },
        textBody: "text-gray-400",
        lineGradientStyle: { backgroundImage: `linear-gradient(to bottom, ${primaryColor}99, ${primaryColor}66, ${primaryColor}33)` },
        monthCard: "bg-white/5 border-white/10",
        monthText: "from-white to-gray-300"
    };

    const handleDaftarSekarang = () => {
        navigate("/event/home");
        window.scrollTo(0, 0);
    };

    return (
        <div className={`relative w-full min-h-screen ${theme.bg} overflow-hidden pt-10 lg:pt-0 pb-20`}>
            <div className="relative z-10 flex flex-col items-center pt-20 md:pt-32 lg:pt-40 pb-16 md:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-6 md:space-y-8 mb-16 md:mb-20 lg:mb-24">
                    <div className="hidden lg:inline-block group">
                        <span className="text-red-500 border-red-500 font-plex font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] border-l-4 pl-4 md:pl-6 relative">
                            JOURNEY & MILESTONES
                            <div className="absolute -left-1 top-0 bottom-0 w-1 bg-red-500/20 group-hover:bg-opacity-40 transition-colors duration-300"></div>
                        </span>
                    </div>

                    <div className="relative">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bebas leading-[0.85] tracking-wide">
                            <span className="bg-clip-text text-transparent" style={theme.textTitleStyle}>
                                Timeline
                            </span>
                        </h1>
                        <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 md:w-24 h-1 rounded-full`} style={theme.lineGradientStyle}></div>
                    </div>

                    <p className={`text-sm sm:text-base md:text-lg lg:text-xl font-plex ${theme.textBody} max-w-4xl mx-auto leading-relaxed font-light px-4`}>
                        Track your progress through the {kompetisiDetail?.nama_event || "Event"} phases.
                    </p>
                </div>

                <div className="w-full max-w-7xl mx-auto relative">
                    <div className={`hidden md:block absolute left-1/2 top-0 bottom-0 w-1 transform -translate-x-1/2 z-0`} style={theme.lineGradientStyle}></div>
                    <div className={`hidden sm:block md:hidden absolute left-8 top-0 bottom-0 w-0.5 z-0`} style={theme.lineGradientStyle}></div>
                    <div className={`sm:hidden absolute left-20 top-0 bottom-0 w-0.5 z-0`} style={theme.lineGradientStyle}></div>

                    {Object.entries(groupedEvents).map(
                        ([month, monthEvents], monthIndex) => (
                            <div key={month} className="relative w-full flex flex-col items-center justify-center mb-16 md:mb-20 lg:mb-24">
                                <div className="relative mb-12 md:mb-16 lg:mb-20 z-20">
                                    <div className="text-center space-y-4">
                                        <div className={`inline-block ${theme.monthCard} border backdrop-blur-md rounded-2xl px-8 py-4 shadow-2xl`}>
                                            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bebas bg-gradient-to-r ${theme.monthText} bg-clip-text text-transparent capitalize tracking-widest`}>
                                                {month}
                                            </h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative w-full z-10">
                                    <div className="flex flex-col items-center justify-center">
                                        {(monthEvents as any[]).map((item, index) => (
                                            <div key={index} className="w-full">
                                                <div className="hidden md:flex w-full items-start justify-center relative group mb-8 md:mb-12">
                                                    <div className={`w-1/2 flex justify-end pr-8 xl:pr-12 2xl:pr-16 ${item.side === "left" ? "" : "invisible"}`}>
                                                        <div className="transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-1 group-hover:-translate-y-1">
                                                            <TimelineCardKiri event={item.event} time={item.time} isModern={true} primaryColor={primaryColor} />
                                                        </div>
                                                    </div>
                                                    <div className="relative flex flex-col items-center justify-start w-16 pt-8 md:pt-10">
                                                        <div className="relative z-20">
                                                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] border-4 border-gray-900 transition-all duration-500 group-hover:scale-125 group-hover:animate-pulse" style={{ backgroundColor: primaryColor }} />
                                                        </div>
                                                    </div>
                                                    <div className={`w-1/2 flex justify-start pl-8 xl:pl-12 2xl:pr-16 ${item.side === "right" ? "" : "invisible"}`}>
                                                        <div className="transform transition-all duration-500 group-hover:scale-105 group-hover:-rotate-1 group-hover:-translate-y-1">
                                                            <TimelineCardKanan event={item.event} time={item.time} isModern={true} primaryColor={primaryColor} />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Tablet/Mobile fallbacks */}
                                                <div className="hidden sm:flex md:hidden w-full justify-start items-start gap-6 px-4 mb-8 group">
                                                    <div className="relative flex flex-col items-center justify-start pt-6">
                                                        <div className="relative z-20">
                                                            <div className="w-6 h-6 rounded-full shadow-md border-2 border-gray-900 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: primaryColor }} />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 transform transition-all duration-300 group-hover:scale-102">
                                                        <TimelineCardKanan event={item.event} time={item.time} isModern={true} primaryColor={primaryColor} />
                                                    </div>
                                                </div>

                                                <div className="sm:hidden flex justify-start items-start gap-4 px-4 mb-6 group">
                                                    <div className="relative flex flex-col items-center justify-start pt-5" style={{ marginLeft: "6px" }}>
                                                        <div className="relative z-20">
                                                            <div className="w-5 h-5 rounded-full shadow-md border-2 border-gray-900 transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: primaryColor }} />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 transform transition-all duration-300 group-hover:scale-[1.02]">
                                                        <TimelineCardKanan event={item.event} time={item.time} isModern={true} primaryColor={primaryColor} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>

                <div className="w-full max-w-4xl mx-auto mt-16 md:mt-20 text-center">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur-xl shadow-2xl">
                        <div className="space-y-8">
                            <h3 className="text-3xl md:text-5xl font-bebas text-white">Ready to Compete?</h3>
                            <p className={`text-sm md:text-lg font-plex ${theme.textBody} leading-relaxed max-w-2xl mx-auto font-light`}>
                                Join the most prestigious championship and showcase your talents on the grand stage.
                            </p>
                            <button onClick={handleDaftarSekarang} className="px-12 py-5 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-xl hover:shadow-red-500/20" style={{ backgroundColor: primaryColor }}>
                                REGISTER NOW
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
