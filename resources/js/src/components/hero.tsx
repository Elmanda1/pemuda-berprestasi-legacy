import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Video, X, ExternalLink } from 'lucide-react';
import hero from '../assets/photos/hero.png'
import { useKompetisi } from "../context/KompetisiContext";
import { apiClient } from "../config/api";

const Hero = () => {
  const { kompetisiDetail } = useKompetisi();
  const [showStreamModal, setShowStreamModal] = useState(false);

  const templateType = kompetisiDetail?.template_type || 'default';
  const isModern = templateType === 'modern' || templateType === 'template_b';

  // Parse streaming data securely
  const streamingData = (() => {
    if (!kompetisiDetail?.streaming_data) return [];
    if (Array.isArray(kompetisiDetail.streaming_data)) return kompetisiDetail.streaming_data;
    try {
      return JSON.parse(kompetisiDetail.streaming_data as string);
    } catch (e) {
      return [];
    }
  })();

  // Fallback to legacy link if no array data
  const legacyLink = kompetisiDetail?.link_streaming;
  const hasStreaming = streamingData.length > 0 || !!legacyLink;

  const handleStreamClick = (e: React.MouseEvent) => {
    if (streamingData.length > 1) {
      e.preventDefault();
      setShowStreamModal(true);
    }
  };

  const primaryStreamUrl = streamingData.length === 1 ? streamingData[0].url : (legacyLink || '#');

  const [landingSettings, setLandingSettings] = useState<{ title: string; subtitle: string } | null>(null);

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res: any = await apiClient.get('/landing-settings');
        if (res.success) setLandingSettings(res.data);
      } catch (err) {
        console.error("Failed to fetch landing settings", err);
      }
    };
    // Only fetch if we're on the main landing page (no kompetisiDetail)
    if (!kompetisiDetail) fetchSettings();
  }, [kompetisiDetail]);

  const displayTitle = landingSettings?.title;
  const displaySubtitle = landingSettings?.subtitle;

  const theme = {
    overlayGradient: isModern ? "from-black/90 via-black/70 to-black/40" : "from-red/90 via-red/70 to-red/40",
    textHighlight: isModern ? "from-white via-gray-200 to-gray-400" : "from-white to-white/80",
    btnPrimary: isModern ? "bg-white text-black hover:bg-gray-200 hover:text-black border-transparent" : "border-white text-white hover:bg-white hover:text-red",
    decorativeBorder: isModern ? "border-white/10" : "border-white/20",
  };

  return (
    <>
      <div className="relative h-[85vh] md:h-[90vh] lg:h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background with Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${hero})` }}
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${theme.overlayGradient}`} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />

        {/* Decorative Elements */}
        <div className={`absolute top-1/4 right-1/4 w-32 h-32 border-2 ${theme.decorativeBorder} rounded-full animate-pulse`}></div>
        <div className={`absolute bottom-1/3 left-1/4 w-24 h-24 border ${theme.decorativeBorder} rounded-full`}></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="w-full max-w-5xl flex flex-col justify-center space-y-6 lg:space-y-8 text-center md:text-left">

            {/* Main Heading */}
            <div className="space-y-2 lg:space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bebas text-white leading-[0.9] tracking-wide drop-shadow-2xl whitespace-pre-line">
                {displayTitle}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-plex font-medium text-white/95 max-w-3xl mx-auto md:mx-0 leading-relaxed drop-shadow-lg">
                {displaySubtitle}
              </p>
            </div>

            {/* CTA Buttons - STYLING TERINTEGRASI */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center pt-2">
              <Link
                to="/events"
                className={`group relative w-auto px-8 py-4 text-xs md:text-lg font-plex font-semibold border-2 bg-transparent transition-all duration-300 rounded-xl backdrop-blur-sm hover:scale-105 hover:shadow-2xl overflow-hidden ${theme.btnPrimary}`}
              >
                <span className="relative px-4 z-10">Lihat Kompetisi</span>
                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>

              {hasStreaming && (
                <a
                  href={streamingData.length > 1 ? '#' : primaryStreamUrl}
                  onClick={handleStreamClick}
                  target={streamingData.length > 1 ? '_self' : '_blank'}
                  rel="noreferrer"
                  className={`group relative w-auto px-8 py-4 text-xs md:text-lg font-plex font-semibold border-2 bg-red text-white border-red transition-all duration-300 rounded-xl hover:scale-105 hover:shadow-2xl flex items-center gap-2`}
                >
                  <Video size={20} className="animate-pulse" />
                  <span>{streamingData.length > 1 ? 'Pilih Channel Live' : 'Live Streaming'}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Streaming Selection Modal */}
      {showStreamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 relative">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-red">
              <h3 className="font-bebas text-2xl text-white tracking-wide flex items-center gap-2">
                <Video size={24} />
                Live Channels
              </h3>
              <button
                onClick={() => setShowStreamModal(false)}
                className="p-1 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
              <p className="text-sm text-gray-500 mb-4 text-center font-inter">
                Silakan pilih channel pertandingan yang ingin Anda saksikan:
              </p>

              {streamingData.map((stream: any, idx: number) => {
                const ytId = stream.video_id;  // Use stored ID directly
                const ytUrl = ytId ? `https://www.youtube.com/watch?v=${ytId}` : '#';

                return (
                  <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                    {ytId ? (
                      <div className="aspect-video w-full bg-black">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${ytId}`}
                          title={stream.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="border-0"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full bg-gray-200 flex items-center justify-center">
                        <Video className="text-gray-400" />
                      </div>
                    )}

                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-gray-900 text-lg">{stream.title || `Channel ${idx + 1}`}</h4>
                      </div>
                      {stream.description && (
                        <p className="text-sm text-gray-500">{stream.description}</p>
                      )}
                      {ytId && (
                        <a href={ytUrl} target="_blank" rel="noreferrer" className="text-xs text-red font-semibold mt-2 inline-block hover:underline flex items-center gap-1">
                          <ExternalLink size={12} />
                          Tonton di YouTube
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}

            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
              <button
                onClick={() => setShowStreamModal(false)}
                className="text-gray-500 font-bold text-sm hover:text-gray-800"
              >
                Tutup
              </button>
            </div>
          </div>
        </div >
      )}
    </>
  );
};

export default Hero;