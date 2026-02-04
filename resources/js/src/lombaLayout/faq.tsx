import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useKompetisi } from "../context/KompetisiContext";
import FaqTemplateDefault from "./FaqTemplateDefault";
import FaqTemplateB from "./FaqTemplateB";
import FaqTemplateC from "./FaqTemplateC";

export default function FAQ() {
  const navigate = useNavigate();
  const { kompetisiDetail } = useKompetisi();

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
    // Redirect to home if faq module is disabled
    if (kompetisiDetail && !isModuleEnabled('faq')) {
      navigate("/event/home");
    }
  }, [kompetisiDetail, modules]);

  const templateType = kompetisiDetail?.template_type || 'default';
  const primaryColor = kompetisiDetail?.primary_color || '#DC2626';

  const sections = (() => {
    const data = kompetisiDetail?.faq_data as any;
    if (Array.isArray(data) && data.length > 0) return data;
    if (typeof data === 'string' && data.trim().length > 0) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse FAQ data:", e);
      }
    }
    return [];
  })();

  const props = {
    kompetisiDetail,
    sections,
    primaryColor
  };

  if (templateType === 'template_c') {
    return <FaqTemplateC {...props} />;
  }

  if (templateType === 'modern' || templateType === 'template_b') {
    return <FaqTemplateB {...props} />;
  }

  return <FaqTemplateDefault {...props} />;
}
