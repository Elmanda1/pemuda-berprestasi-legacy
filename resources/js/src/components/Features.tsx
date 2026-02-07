import React, { useState, useEffect } from "react";
import { useKompetisi } from "../context/KompetisiContext";
import { Shield, Zap, Globe, Cpu, Users, Award } from "lucide-react";
import { apiClient } from "../config/api";

const Features = () => {
    const { kompetisiDetail } = useKompetisi();
    const templateType = kompetisiDetail?.template_type || "default";
    const isModern = templateType === "modern" || templateType === "template_b";

    const [landingSettings, setLandingSettings] = useState<any>(null);

    useEffect(() => {
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

    const theme = {
        bg: "bg-gradient-to-br from-white via-red/[0.02] to-white",
        textMain: "text-black/80",
        textSec: "text-black/70",
        accentText: "text-red",
        cardBg: "bg-white/90 border-red/10",
        iconBg: "from-red/10 to-red/5",
        iconText: "text-red",
        border: "border-red/10",
    };

    const displayTitle = landingSettings?.features_title;

    const features = [
        {
            title: landingSettings?.feature_1_title,
            desc: landingSettings?.feature_1_desc,
            icon: Shield,
        },
        {
            title: landingSettings?.feature_2_title,
            desc: landingSettings?.feature_2_desc,
            icon: Cpu,
        },
        {
            title: landingSettings?.feature_3_title,
            desc: landingSettings?.feature_3_desc,
            icon: Globe,
        },
    ];

    return (
        <section
            className={`py-8 md:py-12 ${theme.bg} relative overflow-hidden`}
        >
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24 space-y-4">
                    <h2
                        className={`text-4xl md:text-6xl font-bebas tracking-tight ${theme.textMain}`}
                    >
                        {displayTitle}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className={`group p-8 rounded-3xl border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${theme.cardBg} hover:bg-red/5 hover:border-red/20`}
                        >
                            <div
                                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.iconBg} flex items-center justify-center ${theme.iconText} mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm border ${theme.border}`}
                            >
                                <feature.icon size={28} />
                            </div>
                            <h3
                                className={`text-2xl font-plex font-bold mb-4 ${theme.textMain}`}
                            >
                                {feature.title}
                            </h3>
                            <p
                                className={`text-base font-plex leading-relaxed ${theme.textSec}`}
                            >
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
