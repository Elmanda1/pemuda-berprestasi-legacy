import { useKompetisi } from "../context/KompetisiContext";
import HomeTemplateDefault from "./HomeTemplateDefault";
import HomeTemplateB from "./HomeTemplateB";

const LandingPage = () => {
  const { kompetisiDetail } = useKompetisi();

  // Setup Dispatcher Logic
  const templateType = kompetisiDetail?.template_type || 'default';

  if (templateType === 'modern' || templateType === 'template_b') {
    return <HomeTemplateB />;
  }

  // Default Fallback
  return <HomeTemplateDefault />;
};

export default LandingPage;
