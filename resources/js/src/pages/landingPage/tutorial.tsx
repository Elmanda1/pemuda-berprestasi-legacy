import { useState, useEffect } from 'react';
import { X, Play, FileText, User, Award, Video, HelpCircle, BookOpen } from 'lucide-react';
import { apiClient } from '../../config/api';
import { useKompetisi } from '../../context/KompetisiContext';
import { useParams } from 'react-router-dom';

// Tipe data Tutorial
interface Tutorial {
  id_tutorial: number;
  title: string;
  description: string;
  video_id: string;
  thumbnail?: string;
  icon_type?: string;
}

const TutorialPage = () => {
  const [selectedVideo, setSelectedVideo] = useState<Tutorial | null>(null);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const { idKompetisi } = useParams<{ idKompetisi: string }>();

  const { kompetisiDetail } = useKompetisi();
  const templateType = kompetisiDetail?.template_type || 'default';
  const isModern = templateType === 'modern' || templateType === 'template_b';

  const theme = {
    bg: isModern ? '#0a0a0a' : '#FFFFFF',
    cardBg: isModern ? '#111111' : '#FFFFFF',
    textPrimary: isModern ? '#FFFFFF' : '#111827',
    textSecondary: isModern ? '#A1A1AA' : '#4B5563',
    primary: isModern ? '#DC2626' : '#DC2626',
    border: isModern ? 'rgba(255,255,255,0.1)' : 'rgba(229, 231, 235, 1)', // gray-200 equivalent
    iconBg: isModern ? 'rgba(255,255,255,0.05)' : '#F3F4F6', // gray-100
  };

  const iconMap: { [key: string]: any } = {
    FileText,
    User,
    Award,
    Video,
    HelpCircle,
    BookOpen
  };

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        setLoading(true);
        // Use provided idKompetisi from URL or fall back to general tutorials
        const url = idKompetisi
          ? `/public/kompetisi/tutorials/${idKompetisi}`
          : '/public/kompetisi/tutorials';

        const res: any = await apiClient.get(url);
        if (res.success) {
          setTutorials(res.data);
        }
      } catch (err) {
        console.error("Error fetching tutorials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorials();
  }, [idKompetisi]);

  const defaultTutorials: Tutorial[] = [
    {
      id_tutorial: 1,
      title: "Registrasi Dojang dan Pelatih",
      description: "Pelajari cara mendaftarkan dojang dan pelatih dalam sistem dengan mudah dan cepat",
      video_id: "blgvr3mGq_0",
      icon_type: 'FileText'
    },
    {
      id_tutorial: 2,
      title: "Registrasi Atlet",
      description: "Tutorial lengkap untuk mendaftarkan atlet baru ke dalam sistem kompetisi",
      video_id: "pcggSEjz3-A",
      icon_type: 'User'
    },
    {
      id_tutorial: 3,
      title: "Registrasi Kompetisi",
      description: "Panduan lengkap mendaftarkan kompetisi dalam sistem manajemen",
      video_id: "3iqZ_c_u000",
      icon_type: 'Award'
    },
    {
      id_tutorial: 4,
      title: "Tutorial Mengambil Sertifikat Atlet",
      description: "Pelajari cara mengambil sertifikat atlet Anda dengan mudah melalui panduan video ini.",
      video_id: "F43jH1sotQY",
      icon_type: 'Award'
    }
  ];

  const displayTutorials = tutorials.length > 0 ? tutorials : defaultTutorials;

  const openModal = (tutorial: Tutorial) => {
    setSelectedVideo(tutorial);
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-screen py-16 sm:py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
      style={{ backgroundColor: theme.bg }}>
      <div className="max-w-7xl mx-auto pt-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-judul font-bebas leading-none tracking-wide mb-8"
            style={{ color: theme.primary }}>
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(to right, ${theme.primary}, ${theme.primary}CC)` }}>
              TUTORIAL
            </span>
          </h1>
          <div className="w-24 h-0.5 mx-auto mb-8" style={{ backgroundColor: theme.primary }}></div>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed font-light"
            style={{ color: theme.textSecondary }}>
            Pelajari sistem registrasi melalui panduan video yang komprehensif
          </p>
        </div>

        {/* Tutorial Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {displayTutorials.map((tutorial, index) => {
            const IconComponent = iconMap[tutorial.icon_type || 'Video'] || Video;
            const thumbnail = tutorial.thumbnail || `https://img.youtube.com/vi/${tutorial.video_id}/maxresdefault.jpg`;

            return (
              <div
                key={tutorial.id_tutorial}
                className="group cursor-pointer transform transition-all duration-700 hover:-translate-y-3"
                onClick={() => openModal(tutorial)}
              >
                <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 border"
                  style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>

                  {/* Video Thumbnail */}
                  <div className="relative aspect-video bg-gray-900 overflow-hidden">
                    <img
                      src={thumbnail}
                      alt={tutorial.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/640x360/374151/ffffff?text=Video+Tutorial';
                      }}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm transform scale-0 group-hover:scale-100 transition-transform duration-500">
                        <Play className="w-6 h-6 text-gray-900 ml-0.5" fill="currentColor" />
                      </div>
                    </div>

                    {/* Number Badge */}
                    <div className="absolute top-6 left-6 w-10 h-10 text-white rounded-full flex items-center justify-center font-bold text-sm"
                      style={{ backgroundColor: theme.primary }}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-500"
                        style={{ backgroundColor: theme.iconBg }}>
                        <IconComponent className="w-6 h-6 transition-colors duration-500"
                          style={{ color: isModern ? theme.textSecondary : '#374151' }} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 leading-tight"
                          style={{ color: theme.textPrimary }}>
                          {tutorial.title}
                        </h3>
                      </div>
                    </div>

                    <p className="leading-relaxed font-light"
                      style={{ color: theme.textSecondary }}>
                      {tutorial.description}
                    </p>

                    {/* Action Indicator */}
                    <div className="mt-6 flex items-center font-medium text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500"
                      style={{ color: theme.primary }}>
                      <span>Tonton Tutorial</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="relative bg-black rounded-2xl overflow-hidden w-full h-full sm:w-[80vw] sm:h-[80vh] max-w-6xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors duration-200 backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video */}
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.video_id}?autoplay=1&rel=0`}
              title={selectedVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorialPage;
