import Section from "../../common/Section/Section";
import ApiGrid from "./ApiGrid/ApiGrid";
import { nasaApis } from "../../../data/nasaApis";

import "./ApiSection.css";

function ApiSection() {
    return (
        <div className="api-section">
            <div className="container">
                <Section
                    eyebrow="Base de dados cósmica"
                    title="Explorações Cósmicas"
                    description="Quatro APIs oficiais da NASA — cada uma com a sua própria página de dados ao vivo. Escolhe por onde começar."
                >
                    <ApiGrid apis={nasaApis} />
                </Section>
            </div>
        </div>
    );
}

export default ApiSection;