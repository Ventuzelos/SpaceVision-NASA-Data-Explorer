import { useTranslation } from "react-i18next";

import ApiIcons from "./ApiIcons/ApiIcons";
import { nasaApis } from "../../../data/nasaApis";

import "./ApiSection.css";

function ApiSection({
  title,
  subtitle,
}) {
  const { t } = useTranslation();

  const sectionTitle =
    title ?? t("home.apiSection.title");

  const sectionSubtitle =
    subtitle ?? t("home.apiSection.subtitle");

  return (
    <div className="api-section">
      <div className="container api-section__content">
        <h2 className="api-section__title">
          {sectionTitle}
        </h2>

        <p className="api-section__subtitle">
          {sectionSubtitle}
        </p>

        <ApiIcons apis={nasaApis} />
      </div>
    </div>
  );
}

export default ApiSection;