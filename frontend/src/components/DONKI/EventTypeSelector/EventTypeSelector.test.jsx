import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import EventTypeSelector from "./EventTypeSelector";

vi.mock("../../../services/donkiService", () => ({
  donkiEventTypes: [
    {
      id: "FLR",
      shortLabel: "Erupções solares",
      description: "Eventos de erupção solar",
      icon: "sun",
      color: "#f59e0b",
    },
    {
      id: "CME",
      shortLabel: "Ejeções de massa coronal",
      description: "Eventos CME",
      icon: "waves",
      color: "#3b82f6",
    },
  ],
}));

describe("EventTypeSelector", () => {
  it("apresenta os tipos de eventos DONKI", () => {
    render(
      <EventTypeSelector
        activeType="FLR"
        onSelect={() => {}}
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
        onSelect={() => {}}
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
    const handleSelect = vi.fn();

    render(
      <EventTypeSelector
        activeType="FLR"
        onSelect={handleSelect}
      />
    );

    fireEvent.click(
      screen.getByRole("tab", {
        name: /ejeções de massa coronal/i,
      })
    );

    expect(handleSelect).toHaveBeenCalledWith(
      "CME"
    );

    expect(handleSelect).toHaveBeenCalledTimes(1);
  });
});