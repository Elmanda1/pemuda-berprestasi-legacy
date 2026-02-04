import { Play, Clapperboard, X } from "lucide-react";

export default function LiveStreamingTemplateB({ kompetisiDetail, videos, openModal, primaryColor }: any) {
    const theme = {
        bg: "bg-[#0a0a0a]",
        textTitleStyle: { backgroundImage: `linear-gradient(to right, #fff, #e5e7eb, #9ca3af)` },
        textBody: "text-gray-400",
        cardBg: "bg-[#111] border-gray-800",
        thumbnailBg: "bg-black",
        textCardTitle: "text-gray-100",
        textCardBody: "text-gray-400",
        iconBg: "bg-gray-800 group-hover:bg-red-900/30",
        iconColor: "text-gray-400 group-hover:text-red-500",
        numberBadgeStyle: { backgroundColor: primaryColor, color: '#fff' }
    };

    return (
        <div className={`min-h-screen ${theme.bg} py-16 sm:py-20 px-4 sm:px-6 lg:px-8`}>
            <div className="max-w-7xl mx-auto pt-16">
                <div className="text-center mb-20 text-white">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bebas leading-none tracking-wide mb-8">
                        <span className="bg-clip-text text-transparent" style={theme.textTitleStyle}>LIVE STREAMING</span>
                    </h1>
                    <div className="w-24 h-0.5 mx-auto mb-8" style={{ backgroundColor: primaryColor }}></div>
                    <p className={`text-xl ${theme.textBody} max-w-2xl mx-auto leading-relaxed font-light`}>
                        Catch all the action live from the arena. Experience the energy and spirit of the {kompetisiDetail?.nama_event || "Championship"}.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-white">
                    {videos.map((video: any, index: number) => {
                        const IconComponent = video.icon;
                        return (
                            <div key={video.id} className="group cursor-pointer transform transition-all duration-700 hover:-translate-y-3" onClick={() => openModal(video)}>
                                <div className={`${theme.cardBg} rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-700 border hover:border-gray-500/50`}>
                                    <div className={`relative aspect-video ${theme.thumbnailBg} overflow-hidden`}>
                                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md transform scale-90 group-hover:scale-100 transition-all duration-500 border border-white/20">
                                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl">
                                                    <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute top-6 left-6 px-4 py-1 rounded-full flex items-center justify-center font-bold text-xs tracking-widest uppercase mb-1" style={theme.numberBadgeStyle}>
                                            BROADCAST #{index + 1}
                                        </div>
                                    </div>
                                    <div className="p-10">
                                        <div className="flex items-center space-x-6 mb-6">
                                            <div className={`w-14 h-14 ${theme.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:rotate-12`}>
                                                <IconComponent className={`w-7 h-7 ${theme.iconColor} transition-colors duration-500`} />
                                            </div>
                                            <h3 className={`text-2xl font-bold ${theme.textCardTitle} leading-tight`}>{video.title}</h3>
                                        </div>
                                        <p className={`${theme.textCardBody} leading-relaxed font-light text-lg`}>{video.description}</p>
                                        <div className="mt-8 flex items-center font-bold text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500" style={{ color: primaryColor }}>
                                            <span>Watch Live BroadCast</span>
                                            <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
