import ApiIcons from "./ApiIcons/ApiIcons";
import { nasaApis } from "../../../data/nasaApis";

import "./ApiSection.css";

function ApiSection({
    title = "Dados oficiais da NASA",
    subtitle = "Explora APIs oficiais da NASA — meteorologia espacial, asteroides e imagens da Terra — ou descobre curiosidades sobre o Universo.",
}) {
    return (
        <div className="api-section">
            <div className="container api-section__content">
                <h2 className="api-section__title">{title}</h2>

                <p className="api-section__subtitle">{subtitle}</p>

                <ApiIcons apis={nasaApis} />
            </div>
        </div>
    );
}

export default ApiSection;