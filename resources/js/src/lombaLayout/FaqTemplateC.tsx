import FaqCard from "../components/faqCard";
import { Search, HelpCircle, MessageCircle } from "lucide-react";

export default function FaqTemplateC({ kompetisiDetail, sections, primaryColor }: any) {
    return (
        <div className="min-h-screen bg-white pt-24 pb-20 font-inter">
            {/* Search Header */}
            <div className="container mx-auto px-6 mb-20">
                <div className="max-w-3xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-100 rounded-full">
                        <HelpCircle size={14} style={{ color: primaryColor }} />
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Help Center</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
                        How can we <span style={{ color: primaryColor }}>help?</span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-xl mx-auto">
                        Find everything you need to know about {kompetisiDetail?.nama_event || "the competition"}.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-5xl">
                <div className="space-y-24">
                    {sections.map((section: any, sectionIndex: number) => (
                        <div key={sectionIndex} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                                <p className="text-gray-500 text-sm leading-relaxed">{section.description}</p>
                                <div className="mt-8 h-px bg-gray-100 w-12" style={{ backgroundColor: primaryColor }} />
                            </div>
                            <div className="lg:col-span-8">
                                <div className="divide-y divide-gray-100 border-t border-gray-100">
                                    {section.questions.map((faq: any, questionIndex: number) => (
                                        <div key={questionIndex} className="py-2 hover:bg-gray-50/50 transition-colors">
                                            <FaqCard question={faq.question} answer={faq.answer} primaryColor={primaryColor} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Support CTA */}
                <div className="mt-32 p-12 bg-gray-50 rounded-3xl border border-gray-100 text-center">
                    <div className="inline-flex p-3 rounded-2xl bg-white shadow-sm mb-6">
                        <MessageCircle size={32} style={{ color: primaryColor }} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Still have questions?</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">We're here to help. Reach out to our support team and we'll get back to you as soon as possible.</p>
                    <button
                        className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg active:scale-95"
                    >
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
}
