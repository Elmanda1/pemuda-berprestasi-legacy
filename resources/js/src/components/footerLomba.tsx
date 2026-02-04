import { useKompetisi } from "../context/KompetisiContext";
import FooterTemplateDefault from "./footer/FooterTemplateDefault";
import FooterTemplateB from "./footer/FooterTemplateB";
import FooterTemplateC from "./footer/FooterTemplateC";

const Footer = () => {
  const { kompetisiDetail } = useKompetisi();
  const templateType = kompetisiDetail?.template_type || 'default';

  if (templateType === 'template_c') {
    return <FooterTemplateC />;
  }

  if (templateType === 'modern' || templateType === 'template_b') {
    return <FooterTemplateB />;
  }

  return <FooterTemplateDefault />;
};

export default Footer;