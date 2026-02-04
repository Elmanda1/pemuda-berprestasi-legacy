import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react";

export default function TimelineTemplateC({ kompetisiDetail, rawEvents, groupedEvents, primaryColor }: any) {
    const navigate = useNavigate();

    const handleDaftarSekarang = () => {
        navigate("/event/home");
        window.scrollTo(0, 0);
    };

    return (
        <div className="min-h-screen bg-white pt-24 pb-20 font-inter">
            {/* Hero Header */}
            <div className="container mx-auto px-6 mb-20 text-center">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                    Event <span style={{ color: primaryColor }}>Timeline</span>
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                    Stay informed about every important milestone of {kompetisiDetail?.nama_event || "the competition"}.
                </p>
            </div>

            <div className="container mx-auto px-6 max-w-4xl relative">
                {/* Timeline Line */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 transform md:-translate-x-1/2 z-0" />

                {Object.entries(groupedEvents).map(([month, monthEvents], monthIndex) => (
                    <div key={month} className="mb-16 relative">
                        {/* Month Header - Fixed Z-Index and Solid Background */}
                        <div className="flex justify-start md:justify-center mb-10 relative z-20">
                            <div className="bg-white px-6 py-2 border border-gray-100 shadow-sm rounded-full">
                                <span className="text-sm font-bold uppercase tracking-widest text-gray-400" style={{ color: primaryColor }}>
                                    {month}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-12">
                            {(monthEvents as any[]).map((item, index) => (
                                <div key={index} className={`relative flex items-center group transition-all duration-300`}>
                                    {/* Desktop Alternating or Single Column? 
                      Let's go with a modern single column with items on the left/right but anchored to the center line.
                  */}
                                    <div className="flex flex-col md:flex-row items-center w-full">
                                        {/* Left side (Desktop) */}
                                        <div className="hidden md:block w-1/2 pr-12 text-right">
                                            {item.side === 'left' && (
                                                <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.event}</h3>
                                                    <div className="flex items-center justify-end gap-2 text-gray-500 text-sm">
                                                        <Clock size={14} />
                                                        <span>{item.time}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Dot */}
                                        <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                                            <div className="w-4 h-4 rounded-full bg-white border-4 transition-transform duration-300 group-hover:scale-150 shadow-sm" style={{ borderColor: primaryColor }} />
                                        </div>

                                        {/* Right side (Desktop) or All (Mobile/Tablet) */}
                                        <div className="w-full md:w-1/2 pl-16 md:pl-12">
                                            {(item.side === 'right' || window.innerWidth < 768) && (
                                                <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.event}</h3>
                                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                        <Clock size={14} />
                                                        <span>{item.time}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Clean Bottom CTA */}
            <div className="container mx-auto px-6 mt-32 text-center">
                <div className="inline-block p-1 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="px-12 py-10 bg-white border border-gray-100 rounded-xl">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Wanna Be a Champion?</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">Registration is open! Secure your spot in the competition today.</p>
                        <button
                            onClick={handleDaftarSekarang}
                            className="inline-flex items-center gap-2 px-8 py-4 text-white font-bold rounded-xl transition-all hover:opacity-90 active:scale-95 shadow-lg"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Get Started <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
