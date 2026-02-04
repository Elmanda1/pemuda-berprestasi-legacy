import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Play, Clapperboard } from "lucide-react";
import { useKompetisi } from "../context/KompetisiContext";
import LiveStreamingTemplateDefault from "./LiveStreamingTemplateDefault";
import LiveStreamingTemplateB from "./LiveStreamingTemplateB";
import LiveStreamingTemplateC from "./LiveStreamingTemplateC";

// Tipe data untuk video
interface LiveVideo {
  id: number;
  title: string;
  description: string;
  videoId: string;
  thumbnail: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export default function LiveStreamingPage() {
  const navigate = useNavigate();
  const { kompetisiDetail } = useKompetisi();
  const [selectedVideo, setSelectedVideo] = useState<LiveVideo | null>(null);

  // Parse modules_enabled
  const modules: any = (() => {
    try {
      if (typeof kompetisiDetail?.modules_enabled === 'string') {
        return JSON.parse(kompetisiDetail.modules_enabled);
      }
      return kompetisiDetail?.modules_enabled || {};
    } catch (e) {
      return {};
    }
  })();

  const isModuleEnabled = (key: string) => {
    return modules[key] !== false;
  };

  useEffect(() => {
    // Redirect to home if live_streaming module is disabled
    if (kompetisiDetail && !isModuleEnabled('live_streaming')) {
      navigate("/event/home");
    }
  }, [kompetisiDetail, modules]);

  const templateType = kompetisiDetail?.template_type || 'default';
  const primaryColor = kompetisiDetail?.primary_color || '#DC2626';

  const videos: LiveVideo[] = [
    {
      id: 1,
      title: "Live Streaming - Hari 1",
      description: "Saksikan pertandingan langsung dari Sriwijaya International Taekwondo Championship.",
      videoId: "vyz5VKM8RRE",
      thumbnail: `https://img.youtube.com/vi/vyz5VKM8RRE/hqdefault.jpg`,
      icon: Clapperboard,
    },
    {
      id: 2,
      title: "Live Streaming - Hari 2",
      description: "Saksikan pertandingan langsung dari Sriwijaya International Taekwondo Championship.",
      videoId: "LfdrEziyU_4",
      thumbnail: `https://img.youtube.com/vi/LfdrEziyU_4/hqdefault.jpg`,
      icon: Clapperboard,
    },
    {
      id: 3,
      title: "Live Streaming - Hari 3",
      description: "Saksikan pertandingan langsung dari Sriwijaya International Taekwondo Championship.",
      videoId: "AFd-GyM4dpM",
      thumbnail: `https://img.youtube.com/vi/AFd-GyM4dpM/hqdefault.jpg`,
      icon: Clapperboard,
    },
    {
      id: 4,
      title: "Live Streaming - Hari 4",
      description: "Saksikan pertandingan langsung dari Sriwijaya International Taekwondo Championship.",
      videoId: "bvJeOk2hQwE",
      thumbnail: `https://img.youtube.com/vi/bvJeOk2hQwE/hqdefault.jpg`,
      icon: Clapperboard,
    },
  ];

  const openModal = (video: LiveVideo) => {
    setSelectedVideo(video);
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  const props = {
    kompetisiDetail,
    videos,
    selectedVideo,
    openModal,
    closeModal,
    primaryColor
  };

  return (
    <>
      <div className="relative">
        {templateType === 'template_c' ? (
          <LiveStreamingTemplateC {...props} />
        ) : (templateType === 'modern' || templateType === 'template_b') ? (
          <LiveStreamingTemplateB {...props} />
        ) : (
          <LiveStreamingTemplateDefault {...props} />
        )}

        {/* Universal Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity duration-500" onClick={closeModal}></div>
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
              <button onClick={closeModal} className="absolute top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all transform hover:rotate-90">
                <X size={24} />
              </button>
              <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`} title={selectedVideo.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
