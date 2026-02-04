import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useKompetisi } from "../context/KompetisiContext";
import TimelineTemplateDefault from "./TimelineTemplateDefault";
import TimelineTemplateB from "./TimelineTemplateB";
import TimelineTemplateC from "./TimelineTemplateC";

export default function Timeline() {
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
    // Redirect to home if timeline module is disabled
    if (kompetisiDetail && !isModuleEnabled('timeline')) {
      navigate("/event/home");
    }
  }, [kompetisiDetail, modules]);

  const templateType = kompetisiDetail?.template_type || 'default';
  const primaryColor = kompetisiDetail?.primary_color || '#DC2626';

  const rawEvents = (() => {
    const data = kompetisiDetail?.timeline_data as any;
    if (Array.isArray(data) && data.length > 0) return data;
    if (typeof data === 'string' && data.trim().length > 0) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse timeline data:", e);
      }
    }
    return [];
  })();

  // Group events by month
  const groupedEvents = rawEvents.reduce((acc: any, curr: any) => {
    const month = curr.month || "Lainnya";
    if (!acc[month]) acc[month] = [];
    acc[month].push(curr);
    return acc;
  }, {} as Record<string, any[]>);

  const props = {
    kompetisiDetail,
    rawEvents,
    groupedEvents,
    primaryColor
  };

  if (templateType === 'template_c') {
    return <TimelineTemplateC {...props} />;
  }

  if (templateType === 'modern' || templateType === 'template_b') {
    return <TimelineTemplateB {...props} />;
  }

  return <TimelineTemplateDefault {...props} />;
}
