import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import DateRangeFilter from "./DateRangeFilter";

describe("DateRangeFilter", () => {
  const defaultProps = {
    startDate: "2026-07-01",
    endDate: "2026-07-15",
    onStartDateChange: vi.fn(),
    onEndDateChange: vi.fn(),
    onSearch: vi.fn(),
    loading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.useFakeTimers();

    vi.setSystemTime(
      new Date("2026-07-15T12:00:00")
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("apresenta as datas atuais", () => {
    render(
      <DateRangeFilter {...defaultProps} />
    );

    expect(
      screen.getByLabelText("Data inicial")
    ).toHaveValue("2026-07-01");

    expect(
      screen.getByLabelText("Data final")
    ).toHaveValue("2026-07-15");
  });

  it("executa a alteração da data inicial", () => {
    render(
      <DateRangeFilter {...defaultProps} />
    );

    fireEvent.change(
      screen.getByLabelText("Data inicial"),
      {
        target: {
          value: "2026-07-05",
        },
      }
    );

    expect(
      defaultProps.onStartDateChange
    ).toHaveBeenCalledWith("2026-07-05");
  });

  it("executa a alteração da data final", () => {
    render(
      <DateRangeFilter {...defaultProps} />
    );

    fireEvent.change(
      screen.getByLabelText("Data final"),
      {
        target: {
          value: "2026-07-14",
        },
      }
    );

    expect(
      defaultProps.onEndDateChange
    ).toHaveBeenCalledWith("2026-07-14");
  });

  it("executa a pesquisa ao submeter o formulário", () => {
    render(
      <DateRangeFilter {...defaultProps} />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Pesquisar eventos",
      })
    );

    expect(
      defaultProps.onSearch
    ).toHaveBeenCalledTimes(1);
  });

  it("aplica o intervalo dos últimos 7 dias", () => {
    render(
      <DateRangeFilter {...defaultProps} />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Últimos 7 dias",
      })
    );

    expect(
      defaultProps.onStartDateChange
    ).toHaveBeenCalledWith("2026-07-08");

    expect(
      defaultProps.onEndDateChange
    ).toHaveBeenCalledWith("2026-07-15");

    expect(
      defaultProps.onSearch
    ).toHaveBeenCalledWith(
      "2026-07-08",
      "2026-07-15"
    );
  });

  it("desativa os controlos de pesquisa durante o carregamento", () => {
    render(
      <DateRangeFilter
        {...defaultProps}
        loading
      />
    );

    expect(
      screen.getByRole("button", {
        name: "A pesquisar...",
      })
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Últimos 7 dias",
      })
    ).toBeDisabled();
  });

  it("limita a data inicial à data final selecionada", () => {
    render(
      <DateRangeFilter {...defaultProps} />
    );

    expect(
      screen.getByLabelText("Data inicial")
    ).toHaveAttribute(
      "max",
      "2026-07-15"
    );
  });

  it("limita a data final à data inicial selecionada", () => {
    render(
      <DateRangeFilter {...defaultProps} />
    );

    expect(
      screen.getByLabelText("Data final")
    ).toHaveAttribute(
      "min",
      "2026-07-01"
    );
  });
});