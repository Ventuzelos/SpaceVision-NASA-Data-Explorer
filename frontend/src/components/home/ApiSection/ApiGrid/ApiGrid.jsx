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
          category={api.category}
          icon={api.icon}
          image={api.image}
          imagePosition={api.imagePosition}
          link={api.link}
        />
      ))}
    </div>
  );
}

export default ApiGrid;