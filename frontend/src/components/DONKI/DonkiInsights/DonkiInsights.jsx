import { useState } from "react";

import CuriosityCard from "../CuriosityCard/CuriosityCard";
import EventExplainer from "../EventExplainer/EventExplainer";
import DailyStatusPanel from "../DailyStatusPanel/DailyStatusPanel";
import { donkiExplainers } from "../../../data/donkiExplainers";

import "./DonkiInsights.css";

const ALL_TABS = [
  { id: "curiosity", label: "Sabias que" },
  { id: "explainer", label: "O que é isto" },
  { id: "status", label: "Estado do dia" },
];

function DonkiInsights({ type, events, loading, error }) {
  const [activeTabId, setActiveTabId] = useState("curiosity");

  const tabs = ALL_TABS.filter(
    (tab) =>
      tab.id !== "explainer" || Boolean(donkiExplainers[type])
  );

  const currentTabId = tabs.some(
    (tab) => tab.id === activeTabId
  )
    ? activeTabId
    : tabs[0]?.id;

  return (
    <div className="donki-insights">
      <div
        className="donki-insights__tabs"
        role="tablist"
        aria-label="Informações sobre o tipo de evento selecionado"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={currentTabId === tab.id}
            className={`donki-insights__tab ${
              currentTabId === tab.id
                ? "donki-insights__tab--active"
                : ""
            }`}
            onClick={() => setActiveTabId(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="donki-insights__panel">
        {currentTabId === "curiosity" && (
          <CuriosityCard type={type} />
        )}

        {currentTabId === "explainer" && (
          <EventExplainer type={type} />
        )}

        {currentTabId === "status" && (
          <DailyStatusPanel
            type={type}
            events={events}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </div>
  );
}

export default DonkiInsights;
