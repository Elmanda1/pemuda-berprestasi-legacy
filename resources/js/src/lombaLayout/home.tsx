import { useKompetisi } from "../context/KompetisiContext";
import HomeTemplateDefault from "./HomeTemplateDefault";
import HomeTemplateB from "./HomeTemplateB";
import HomeTemplateC from "./HomeTemplateC";

const LandingPage = () => {
  const { kompetisiDetail } = useKompetisi();

  // Setup Dispatcher Logic
  const templateType = kompetisiDetail?.template_type || 'default';

  if (templateType === 'modern' || templateType === 'template_b') {
    return <HomeTemplateB />;
  }

  // New Template C
  if (templateType === 'clean' || templateType === 'template_c') {
    return <HomeTemplateC />;
  }

  // Default Fallback
  return <HomeTemplateDefault />;
};

export default LandingPage;
