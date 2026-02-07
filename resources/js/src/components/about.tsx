import React, { useState } from "react";
import belt from '../assets/photos/belt.jpg'
import { useKompetisi } from "../context/KompetisiContext";
import { apiClient } from "../config/api";

const About = () => {
  const { kompetisiDetail } = useKompetisi();
  const templateType = kompetisiDetail?.template_type || 'default';
  const isModern = templateType === 'modern' || templateType === 'template_b';

  const [landingSettings, setLandingSettings] = useState<{ about_title: string; about_content: string } | null>(null);

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res: any = await apiClient.get('/landing-settings');
        if (res.success) setLandingSettings(res.data);
      } catch (err) {
        console.error("Failed to fetch landing settings", err);
      }
    };
    if (!kompetisiDetail) fetchSettings();
  }, [kompetisiDetail]);

  const displayAboutTitle = landingSettings?.about_title;
  const displayAboutContent = landingSettings?.about_content;

  const theme = {
    bg: isModern ? "bg-black" : "bg-gradient-to-br from-white via-red/[0.02] to-white",
    textMain: isModern ? "text-white" : "text-black/85",
    textSec: isModern ? "text-gray-400" : "text-black/70",
    accentText: isModern ? "text-white" : "text-red",
    border: isModern ? "border-white/10" : "border-red/[0.08]",
    gradientText1: isModern ? "from-white via-gray-200 to-gray-400" : "from-red via-red/90 to-red/80",
    gradientText2: isModern ? "from-gray-300 via-gray-400 to-gray-500" : "from-red/80 via-red/90 to-red",
    cardHover: isModern ? "hover:bg-white/5 hover:shadow-white/5" : "hover:bg-red/[0.02] hover:shadow-red/10",
    iconBg: isModern ? "from-white/10 to-white/5" : "from-red/10 to-red/5",
    iconInner: isModern ? "from-white to-gray-400" : "from-red to-red/80",
    dots: isModern ? "bg-white/20" : "bg-red/20",
  };

  return (
    <section className={`relative w-full flex items-center overflow-hidden py-8 md:py-12 lg:py-16 ${theme.bg}`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-48 md:w-72 lg:w-96 h-48 md:h-72 lg:h-96 border rounded-full animate-pulse opacity-40 ${theme.border}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-36 md:w-56 lg:w-72 h-36 md:h-56 lg:h-72 border rounded-full animate-pulse opacity-30 animation-delay-1000 ${theme.border}`}></div>
        <div className={`absolute top-1/2 right-1/3 w-2 h-2 rounded-full animate-bounce opacity-60 ${theme.dots}`}></div>
        <div className={`absolute bottom-1/3 left-1/4 w-1 h-1 rounded-full animate-bounce animation-delay-500 ${theme.dots}`}></div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 xl:gap-16 items-center max-w-7xl mx-auto">

          {/* Text Content */}
          <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
            {/* Section Label with Animation */}
            <div className="inline-block group">
              <span className={`font-plex font-semibold text-sm uppercase tracking-[0.2em] border-l-4 pl-4 md:pl-6 relative ${theme.accentText} ${isModern ? "border-white" : "border-red"}`}>
                Tentang Kami
                <div className={`absolute -left-1 top-0 bottom-0 w-1 transition-colors duration-300 ${isModern ? "bg-white/20 group-hover:bg-white/40" : "bg-red/20 group-hover:bg-red/40"}`}></div>
              </span>
            </div>

            {/* Main Heading with Gradient Text */}
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bebas leading-[0.85] tracking-wide whitespace-pre-line bg-gradient-to-r bg-clip-text text-transparent from-red via-red/90 to-red/80">
                {displayAboutTitle}
              </h2>
              {/* Subtle underline accent */}
              <div className={`absolute -bottom-2 left-0 w-16 md:w-24 h-1 bg-gradient-to-r rounded-full ${isModern ? "from-white to-gray-500" : "from-red to-red/60"}`}></div>
            </div>

            {/* Enhanced Description */}
            <div className="space-y-4 md:space-y-6 max-w-2xl">
              <p className="text-base md:text-lg lg:text-xl xl:text-2xl font-plex text-black/85 leading-relaxed font-light whitespace-pre-line">
                {displayAboutContent}
              </p>
            </div>
          </div>

          {/* Enhanced Image Section */}
          <div className="relative order-1 lg:order-2">
            <div className="relative h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px] xl:h-[480px] w-full group">

              {/* Enhanced Background Decorative Elements */}
              <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br from-red/8 to-red/4 rounded-full blur-sm group-hover:scale-110 transition-transform duration-700"></div>
              <div className="absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-red/6 to-red/3 rounded-full blur-sm group-hover:scale-110 transition-transform duration-700 animation-delay-200"></div>
              <div className="absolute top-1/4 -right-2 md:-right-4 w-3 h-3 md:w-4 md:h-4 bg-red/30 rounded-full animate-ping"></div>
              <div className="absolute bottom-1/3 -left-1 md:-left-2 w-2 h-2 md:w-3 md:h-3 bg-red/20 rounded-full animate-ping animation-delay-1000"></div>

              {/* Main Image Container with Enhanced Effects */}
              <div className="relative w-full h-full rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl bg-gradient-to-br from-red/5 via-white to-red/3 group-hover:shadow-2xl md:group-hover:shadow-3xl group-hover:shadow-red/20 transition-all duration-700">
                {/* Glass morphism overlay */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>

                <img
                  src={belt}
                  alt="Taekwondo Belt - Symbol of Achievement and Dedication"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />

                {/* Enhanced Image Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-red/15 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-red/5"></div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;