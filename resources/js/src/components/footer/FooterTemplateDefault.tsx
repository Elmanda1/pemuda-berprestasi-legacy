import { Link } from "react-router-dom";
import { useKompetisi } from "../../context/KompetisiContext";

const FooterTemplateDefault = () => {
    const { kompetisiDetail } = useKompetisi();

    const theme = {
        bg: "bg-gradient-to-b from-red to-red/95",
        text: "text-white",
        highlight: "text-white",
        border: "border-white/15",
        accent: "from-white/30",
        hoverLink: "hover:text-white/90",
        underline: "bg-white/60",
        circleBorder: "border-white/20",
    };

    return (
        <footer className={`relative w-full py-8 overflow-hidden ${theme.bg} ${theme.text}`}>
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className={`absolute top-0 left-1/4 w-32 h-32 border ${theme.circleBorder} rounded-full`}></div>
                <div className={`absolute bottom-0 right-1/4 w-24 h-24 border ${theme.circleBorder} rounded-full`}></div>
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border ${theme.circleBorder} rounded-full`}></div>
            </div>

            <div className="container mx-auto px-6 lg:px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="group">
                        <h1 className={`text-3xl lg:text-4xl font-bebas tracking-wide hover:scale-105 transition-transform duration-300 cursor-default ${theme.highlight}`}>
                            <span className="bg-gradient-to-r from-white via-white/95 to-white/90 bg-clip-text text-transparent">
                                {kompetisiDetail?.nama_event || "Pemuda Berprestasi"}
                            </span>
                        </h1>
                        <div className={`w-0 group-hover:w-full h-0.5 bg-gradient-to-r ${theme.accent} to-transparent transition-all duration-500 mt-1`}></div>
                    </div>

                    <nav className="flex gap-8 mt-6 md:mt-0 font-plex">
                        <Link to="/event/home" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className={`group relative px-1 py-2 ${theme.hoverLink} transition-all duration-300`}>
                            <span className="relative z-10">Home</span>
                            <div className={`absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 ${theme.underline} transition-all duration-300`}></div>
                        </Link>
                        <Link to="/event/timeline" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className={`group relative px-1 py-2 ${theme.hoverLink} transition-all duration-300`}>
                            <span className="relative z-10">Timeline</span>
                            <div className={`absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 ${theme.underline} transition-all duration-300`}></div>
                        </Link>
                        <Link to="/event/faq" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className={`group relative px-1 py-2 ${theme.hoverLink} transition-all duration-300`}>
                            <span className="relative z-10">FAQ</span>
                            <div className={`absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 ${theme.underline} transition-all duration-300`}></div>
                        </Link>
                    </nav>
                </div>

                <div className={`mt-8 pt-6 border-t ${theme.border} relative`}>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm font-plex text-white/80">
                            © {new Date().getFullYear()} {kompetisiDetail?.nama_event || "Pemuda Berprestasi"}. All rights reserved.
                        </p>
                    </div>
                    <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent ${theme.accent} to-transparent`}></div>
                </div>
            </div>
        </footer>
    );
};

export default FooterTemplateDefault;
