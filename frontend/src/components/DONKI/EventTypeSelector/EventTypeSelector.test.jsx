import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import i18n from "../../../i18n";

import EventTypeSelector from "./EventTypeSelector";

vi.mock(
  "../../../services/donkiService",
  () => ({
    donkiEventTypes: [
      {
        id: "FLR",
        shortLabelKey:
          "donki.eventTypes.flr.label",
        descriptionKey:
          "donki.eventTypes.flr.description",
        icon: "sun",
        color: "#f59e0b",
      },
      {
        id: "CME",
        shortLabelKey:
          "donki.eventTypes.cme.label",
        descriptionKey:
          "donki.eventTypes.cme.description",
        icon: "waves",
        color: "#3b82f6",
      },
    ],
  })
);

describe("EventTypeSelector", () => {
  const onSelect = vi.fn();

  beforeEach(async () => {
    await i18n.changeLanguage("pt");
    vi.clearAllMocks();
  });

  it("apresenta os tipos de eventos DONKI", () => {
    render(
      <EventTypeSelector
        activeType="FLR"
        onSelect={onSelect}
      />
    );

    expect(
      screen.getByRole("tab", {
        name: /erupções solares/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("tab", {
        name: /ejeções de massa coronal/i,
      })
    ).toBeInTheDocument();
  });

  it("identifica o tipo ativo", () => {
    render(
      <EventTypeSelector
        activeType="FLR"
        onSelect={onSelect}
      />
    );

    expect(
      screen.getByRole("tab", {
        name: /erupções solares/i,
      })
    ).toHaveAttribute(
      "aria-selected",
      "true"
    );

    expect(
      screen.getByRole("tab", {
        name: /ejeções de massa coronal/i,
      })
    ).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  it("executa onSelect com o tipo escolhido", () => {
    render(
      <EventTypeSelector
        activeType="FLR"
        onSelect={onSelect}
      />
    );

    fireEvent.click(
      screen.getByRole("tab", {
        name: /ejeções de massa coronal/i,
      })
    );

    expect(onSelect).toHaveBeenCalledTimes(
      1
    );

    expect(onSelect).toHaveBeenCalledWith(
      "CME"
    );
  });
});