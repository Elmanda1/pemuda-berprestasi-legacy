import { Play, PlayCircle, Video, Info } from "lucide-react";

export default function LiveStreamingTemplateC({ kompetisiDetail, videos, openModal, primaryColor }: any) {
    return (
        <div className="min-h-screen bg-white pt-24 pb-20 font-inter">
            {/* Search Header */}
            <div className="container mx-auto px-6 mb-20">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-100 rounded-full">
                        <Video size={14} style={{ color: primaryColor }} />
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Live Coverage</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight">
                        Follow the <span style={{ color: primaryColor }}>Action.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Exclusive live access to every match of {kompetisiDetail?.nama_event || "the championship"}. Feel the pulse of the competition from anywhere.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.map((video: any, index: number) => (
                        <div
                            key={video.id}
                            className="group flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 cursor-pointer"
                            onClick={() => openModal(video)}
                        >
                            <div className="relative aspect-video overflow-hidden">
                                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-500"></div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="p-4 bg-white/95 rounded-full shadow-2xl backdrop-blur-md">
                                        <PlayCircle size={48} style={{ color: primaryColor }} fill="white" />
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-white/20 shadow-sm">
                                    Live Stream #{index + 1}
                                </div>
                            </div>
                            <div className="p-8 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors" style={{ color: 'inherit' }}>
                                        <span className="group-hover:underline decoration-2 underline-offset-4" style={{ textDecorationColor: primaryColor }}>
                                            {video.title}
                                        </span>
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-6">
                                        {video.description}
                                    </p>
                                </div>
                                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }}></div>
                                        STREAMING NOW
                                    </div>
                                    <button className="p-2 rounded-full hover:bg-gray-50 transition-colors" style={{ color: primaryColor }}>
                                        <Play size={18} fill="currentColor" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Box */}
                <div className="mt-24 p-8 md:p-12 border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 bg-gray-50/30">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm shrink-0">
                        <Info size={32} style={{ color: primaryColor }} />
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Technical Support</h4>
                        <p className="text-gray-500 text-sm max-w-2xl">Having trouble with the stream? Ensure you have a stable internet connection or try refreshing the page. Our streams are optimized for all devices including mobile and desktop.</p>
                    </div>
                    <button className="md:ml-auto px-8 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-sm">
                        Read Streaming Guide
                    </button>
                </div>
            </div>
        </div>
    );
}
