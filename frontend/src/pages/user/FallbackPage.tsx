import AppLink from "../../components/ui/AppLink.tsx";
import {useTranslation} from "react-i18next";

function FallbackPage() {
  const {t} = useTranslation();

  return (
    <div>
      <h1 style={{lineHeight: 1.6}}>{t("pages.fallback.title")}</h1>
      <p>{t("pages.fallback.subtitle")}</p>
      <AppLink to="/" textAlign="center" mt={2}>{'< ' + t("pages.fallback.go_home")}</AppLink>
    </div>
  );
}

export default FallbackPage;
