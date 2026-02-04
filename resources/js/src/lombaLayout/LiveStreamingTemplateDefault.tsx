import { Play, Clapperboard, X } from "lucide-react";

export default function LiveStreamingTemplateDefault({ kompetisiDetail, videos, openModal, primaryColor }: any) {
    const theme = {
        bg: "bg-white",
        textTitleStyle: { backgroundImage: `linear-gradient(to right, ${primaryColor}, ${primaryColor}e6, ${primaryColor}cc)` },
        textBody: "text-gray-600",
        cardBg: "bg-white border-gray-100",
        thumbnailBg: "bg-gray-900",
        textCardTitle: "text-gray-900",
        textCardBody: "text-gray-600",
        iconBg: "bg-gray-100 group-hover:bg-red-50",
        iconColor: "text-gray-700 group-hover:text-red-600",
        numberBadgeStyle: { backgroundColor: primaryColor, color: '#fff' }
    };

    return (
        <div className={`min-h-screen ${theme.bg} py-16 sm:py-20 px-4 sm:px-6 lg:px-8`}>
            <div className="max-w-7xl mx-auto pt-16">
                <div className="text-center mb-20">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bebas leading-none tracking-wide mb-8">
                        <span className="bg-clip-text text-transparent" style={theme.textTitleStyle}>Live Streaming</span>
                    </h1>
                    <div className="w-24 h-0.5 mx-auto mb-8" style={{ backgroundColor: primaryColor }}></div>
                    <p className={`text-xl ${theme.textBody} max-w-2xl mx-auto leading-relaxed font-light`}>
                        Saksikan pertandingan langsung dari arena melalui kanal YouTube resmi {kompetisiDetail?.nama_event || "Kompetisi"}.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {videos.map((video: any, index: number) => {
                        const IconComponent = video.icon;
                        return (
                            <div key={video.id} className="group cursor-pointer transform transition-all duration-700 hover:-translate-y-3" onClick={() => openModal(video)}>
                                <div className={`${theme.cardBg} rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 border hover:border-gray-500/30`}>
                                    <div className={`relative aspect-video ${theme.thumbnailBg} overflow-hidden`}>
                                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm transform scale-0 group-hover:scale-100 transition-transform duration-500">
                                                <Play className="w-6 h-6 text-gray-900 ml-0.5" fill="currentColor" />
                                            </div>
                                        </div>
                                        <div className="absolute top-6 left-6 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={theme.numberBadgeStyle}>
                                            {index + 1}
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex items-start space-x-4 mb-4">
                                            <div className={`w-12 h-12 ${theme.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-500`}>
                                                <IconComponent className={`w-6 h-6 ${theme.iconColor} transition-colors duration-500`} />
                                            </div>
                                            <h3 className={`text-xl font-bold ${theme.textCardTitle} mb-2 leading-tight`}>{video.title}</h3>
                                        </div>
                                        <p className={`${theme.textCardBody} leading-relaxed font-light`}>{video.description}</p>
                                        <div className="mt-6 flex items-center font-medium text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500" style={{ color: primaryColor }}>
                                            <span>Tonton Sekarang</span>
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
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
