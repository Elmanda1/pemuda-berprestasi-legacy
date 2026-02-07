import GeneralButton from "./generalButton";
import sriwijaya from "../assets/logo/sriwijaya.png";
import { useKompetisi, Kompetisi } from "../context/KompetisiContext";

interface CompCardProps {
  kompetisi?: Kompetisi;
}

const CompCard = ({ kompetisi }: CompCardProps) => {
  const { kompetisiDetail: contextKomp } = useKompetisi();
  
  // Use passed kompetisi prop if available, otherwise fallback to context
  const data = kompetisi || contextKomp;
  
  const templateType = data?.template_type || 'default';
  const isModern = templateType === 'modern' || templateType === 'template_b';

  const theme = {
    cardBg: isModern ? "bg-[#161616] border-gray-800" : "bg-white border-yellow",
    shadow: isModern ? "shadow-black/50" : "shadow-xl",
    title: isModern ? "text-white" : "text-red",
    desc: isModern ? "text-gray-400" : "text-black/80",
    btnPrimary: isModern ? "bg-red-600 hover:bg-red-700 text-white shadow-red-900/30" : "bg-red text-white hover:bg-yellow hover:text-black shadow-red/30",
    btnSecondary: isModern ? "bg-white text-black hover:bg-gray-200 shadow-white/10" : "bg-yellow text-black hover:bg-red hover:text-white shadow-yellow/30"
  };

  const competitionUrl = data?.slug ? `/${data.slug}/home` : "/event/home";

  // Determine status label and styling
  const getStatusInfo = () => {
    const status = data?.status?.toUpperCase();
    switch (status) {
      case 'SELESAI':
      case 'FINISHED':
      case 'COMPLETED':
        return { label: 'SELESAI', color: 'bg-gray-600', textColor: 'text-white' };
      case 'PENDAFTARAN':
      case 'REGISTRATION':
        return { label: 'PENDAFTARAN', color: 'bg-green-600', textColor: 'text-white' };
      case 'SEDANG_DIMULAI':
      case 'ONGOING':
      case 'STARTED':
        return { label: 'SEDANG BERLANGSUNG', color: 'bg-blue-600', textColor: 'text-white' };
      default:
        return { label: status || 'PENDAFTARAN', color: 'bg-green-600', textColor: 'text-white' };
    }
  };

  const statusInfo = getStatusInfo();
  const isCompleted = data?.status?.toUpperCase() === 'SELESAI' || 
                      data?.status?.toUpperCase() === 'FINISHED' || 
                      data?.status?.toUpperCase() === 'COMPLETED';

  return (
    <div className={`border-2 shadow-2xl rounded-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 ease-in-out 
                    flex flex-col md:flex-row items-center gap-4 md:gap-6 lg:gap-8 xl:gap-12 
                    px-4 sm:px-6 lg:px-8 xl:px-12 py-6 md:py-8 
                    w-full max-w-5xl mx-auto ${theme.cardBg} ${theme.shadow} relative overflow-hidden`}>
      
      {/* Status Ribbon Badge */}
      <div className={`absolute -left-14 top-6 ${statusInfo.color} ${statusInfo.textColor} 
                      px-24 py-1.5 text-md font-bold shadow-xl z-[20] 
                      -rotate-25 origin-center transform tracking-wider`}>
        {statusInfo.label}
      </div>

      {/* Gray Overlay for Completed */}
      {isCompleted && (
        <div className="absolute inset-0 bg-black/20 rounded-2xl z-[5]" />
      )}

      {/* Image Container */}
      <div className={`flex-shrink-0 flex items-center justify-center ${isCompleted ? 'relative z-[6]' : ''}`}>
        <img
          src={data?.logo_url || sriwijaya}
          alt={data?.nama_event || "Sriwijaya Championship Logo"}
          className={`h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-40 lg:w-40 xl:h-48 xl:w-48 2xl:h-56 2xl:w-56 
                     object-contain transition-transform duration-300 hover:scale-105`}
        />
      </div>

      {/* Content Container */}
      <div className={`flex-1 flex flex-col justify-between gap-4 md:gap-6 w-full min-h-0 ${isCompleted ? 'relative z-[6]' : ''}`}>
        {/* Title + Description Container */}
        <div className="flex flex-col gap-2 md:gap-3 text-center md:text-left">
          <h3 className={`font-bebas text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 
                         leading-none md:leading-tight ${theme.title} ${isCompleted ? 'opacity-80' : ''}`}>
            {data?.nama_event || "Sriwijaya International Taekwondo Championship 2025"}
          </h3>
          <p className={`font-plex text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl 
                        leading-relaxed hidden sm:block md:line-clamp-3 lg:line-clamp-none ${theme.desc} ${isCompleted ? 'opacity-70' : ''}`}>
            {data?.hero_description || "Kompetisi taekwondo internasional bergengsi yang menggabungkan tradisi dan inovasi, menghadirkan standar kompetisi kelas dunia untuk para atlet berprestasi."}
          </p>
        </div>

        {/* Button Container */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start lg:justify-end">
          <GeneralButton
            to={competitionUrl}
            label="Join the Competition"
            type="link"
            className={`active:scale-95 hover:shadow-lg transition-all duration-300 font-semibold 
                       h-10 sm:h-11 md:h-12 lg:h-12 xl:h-14
                       rounded-2xl 
                       text-xs sm:text-sm md:text-base lg:text-base xl:text-lg
                       px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10
                       py-2 sm:py-2.5 md:py-3 lg:py-3 xl:py-4
                       whitespace-nowrap ${theme.btnPrimary} ${isCompleted ? 'opacity-60' : ''}`}
          />

          {/* Download Proposal Button */}
          <a
            href="https://drive.google.com/file/d/1vA7Rc6scIsrEHVjajt3WIagbhx_9i_po/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className={`active:scale-95 hover:shadow-lg transition-all duration-300 font-semibold 
                       h-10 sm:h-11 md:h-12 lg:h-12 xl:h-14
                       rounded-2xl 
                       text-xs sm:text-sm md:text-base lg:text-base xl:text-lg
                       px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10
                       py-2 sm:py-2.5 md:py-3 lg:py-3 xl:py-4
                       whitespace-nowrap
                       flex items-center justify-center
                       no-underline ${theme.btnSecondary} ${isCompleted ? 'opacity-60' : ''}`}
          >
            Download Proposal
          </a>
        </div>
      </div>
    </div>
  );
};

export default CompCard;