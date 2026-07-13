import "./ApiSection.css";
// import ApiCard from "./ApiCard/ApiCard";
import ApiGrid from "./ApiGrid/ApiGrid";
import { nasaApis } from "../../../data/nasaApis";


function ApiSection() {

    return (
        <section className="api-section">
            <div className="container api-section__container">
                <h2 className="api-section__title">
                    Explora NASA APIs
                </h2>

                <ApiGrid apis={nasaApis} />
            </div>
        </section>
    );
}

export default ApiSection;