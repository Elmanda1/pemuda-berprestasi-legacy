import { useKompetisi } from "../../context/KompetisiContext";
import NavbarTemplateDefault from "./NavbarTemplateDefault";
import NavbarTemplateB from "./NavbarTemplateB";
import NavbarTemplateC from "./NavbarTemplateC";

const NavbarLomba = ({ onLogoutRequest }: { onLogoutRequest: () => void }) => {
  const { kompetisiDetail } = useKompetisi();

  // Determine template type
  const templateType = kompetisiDetail?.template_type || 'default';

  // Render appropriate template
  if (templateType === 'template_c') {
    return <NavbarTemplateC onLogoutRequest={onLogoutRequest} />;
  }

  if (templateType === 'modern' || templateType === 'template_b') {
    return <NavbarTemplateB onLogoutRequest={onLogoutRequest} />;
  }

  // Default fallback
  return <NavbarTemplateDefault onLogoutRequest={onLogoutRequest} />;
};

export default NavbarLomba;