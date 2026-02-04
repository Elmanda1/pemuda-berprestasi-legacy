import { Phone, Instagram, Mail, MapPin, Globe, Facebook, Twitter } from "lucide-react";
import { useKompetisi } from "../../context/KompetisiContext";
import { Link } from "react-router-dom";

const FooterTemplateC = () => {
    const { kompetisiDetail } = useKompetisi();
    const primaryColor = kompetisiDetail?.primary_color || '#DC2626';

    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: Instagram, href: kompetisiDetail?.contact_instagram || "#", label: "Instagram" },
        { icon: Facebook, href: "#", label: "Facebook" },
        { icon: Twitter, href: "#", label: "Twitter" },
    ];

    const quickLinks = [
        { label: "Home", to: "/event/home" },
        { label: "Timeline", to: "/event/timeline" },
        { label: "FAQ", to: "/event/faq" },
        { label: "Live Streaming", to: "/event/live-streaming" },
    ];

    return (
        <footer className="bg-white border-t border-gray-100 pt-20 pb-10 font-inter">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                            {kompetisiDetail?.nama_event || "CHAMPIONSHIP"}
                        </h2>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            {kompetisiDetail?.hero_description || "Empowering the next generation of champions through excellence and sportsmanship."}
                        </p>
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:border-transparent"
                                    style={{ '--hover-bg': primaryColor } as any}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Navigation</h3>
                        <ul className="space-y-4">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        to={link.to}
                                        className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Contact</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-gray-500">
                                <MapPin size={18} className="shrink-0" style={{ color: primaryColor }} />
                                <span>{kompetisiDetail?.contact_venue_name || "International Arena"}</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-500">
                                <Phone size={18} className="shrink-0" style={{ color: primaryColor }} />
                                <span>{kompetisiDetail?.contact_phone_1 || "+62 000 0000"}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter/Action */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">Get Notified</h3>
                        <p className="text-gray-500 text-sm">Join our mailing list to stay updated with latest event news.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                                style={{ '--tw-ring-color': primaryColor } as any}
                            />
                            <button
                                className="px-4 py-2 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95"
                                style={{ backgroundColor: primaryColor }}
                            >
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-gray-400 font-medium">
                        © {currentYear} {kompetisiDetail?.nama_event}. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8">
                        <a href="#" className="text-xs text-gray-400 hover:text-gray-900 transition-colors">Privacy Policy</a>
                        <a href="#" className="text-xs text-gray-400 hover:text-gray-900 transition-colors">Terms of Service</a>
                        <a href="#" className="text-xs text-gray-400 hover:text-gray-900 transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterTemplateC;
