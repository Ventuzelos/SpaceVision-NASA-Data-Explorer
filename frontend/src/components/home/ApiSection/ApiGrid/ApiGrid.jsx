import ApiCard from "../ApiCard/ApiCard";

import "./ApiGrid.css";

function ApiGrid({ apis }) {
  return (
    <div className="api-grid">
      {apis.map((api) => (
        <ApiCard
          key={api.title}
          title={api.title}
          description={api.description}
          image={api.image}
          link={api.link}
        />
      ))}
    </div>
  );
}

export default ApiGrid;