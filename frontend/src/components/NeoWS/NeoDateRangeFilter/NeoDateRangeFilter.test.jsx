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

import i18n from "../../../i18n";

import NeoDateRangeFilter from "./NeoDateRangeFilter";

// Construção e formatação em hora local em toda a função.
// Evita toISOString e parsing UTC, garantindo o mesmo
// resultado localmente e na pipeline de CI.
function toLocalISODate(date) {
  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseLocalISODate(
  isoString
) {
  const [year, month, day] =
    isoString
      .split("-")
      .map(Number);

  return new Date(
    year,
    month - 1,
    day
  );
}

vi.mock(
  "../../../services/neowsService",
  () => ({
    MAX_RANGE_DAYS: 7,

    clampDateRange: vi.fn(
      (
        startDate,
        endDate
      ) => {
        const start =
          parseLocalISODate(
            startDate
          );

        const end =
          parseLocalISODate(
            endDate
          );

        const maximumEnd =
          new Date(start);

        maximumEnd.setDate(
          maximumEnd.getDate() +
            7
        );

        if (end > maximumEnd) {
          return {
            startDate,
            endDate:
              toLocalISODate(
                maximumEnd
              ),
            wasClamped: true,
          };
        }

        return {
          startDate,
          endDate,
          wasClamped: false,
        };
      }
    ),
  })
);

describe(
  "NeoDateRangeFilter",
  () => {
    const defaultProps = {
      startDate:
        "2026-07-15",
      endDate:
        "2026-07-18",
      onStartDateChange:
        vi.fn(),
      onEndDateChange:
        vi.fn(),
      onSearch: vi.fn(),
      loading: false,
    };

    beforeEach(async () => {
      vi.clearAllMocks();
      vi.useFakeTimers();

      vi.setSystemTime(
        new Date(
          2026,
          6,
          15,
          12,
          0,
          0
        )
      );

      await i18n.changeLanguage(
        "pt"
      );
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it(
      "apresenta as datas selecionadas",
      () => {
        render(
          <NeoDateRangeFilter
            {...defaultProps}
          />
        );

        expect(
          screen.getByLabelText(
            "Data inicial"
          )
        ).toHaveValue(
          "2026-07-15"
        );

        expect(
          screen.getByLabelText(
            "Data final"
          )
        ).toHaveValue(
          "2026-07-18"
        );
      }
    );

    it(
      "aplica o preset de hoje",
      () => {
        render(
          <NeoDateRangeFilter
            {...defaultProps}
          />
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Hoje",
            }
          )
        );

        expect(
          defaultProps
            .onStartDateChange
        ).toHaveBeenCalledWith(
          "2026-07-15"
        );

        expect(
          defaultProps
            .onEndDateChange
        ).toHaveBeenCalledWith(
          "2026-07-15"
        );

        expect(
          defaultProps.onSearch
        ).toHaveBeenCalledWith(
          "2026-07-15",
          "2026-07-15"
        );
      }
    );

    it(
      "aplica o preset dos próximos 3 dias",
      () => {
        render(
          <NeoDateRangeFilter
            {...defaultProps}
          />
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Próximos 3 dias",
            }
          )
        );

        expect(
          defaultProps
            .onStartDateChange
        ).toHaveBeenCalledWith(
          "2026-07-15"
        );

        expect(
          defaultProps
            .onEndDateChange
        ).toHaveBeenCalledWith(
          "2026-07-18"
        );

        expect(
          defaultProps.onSearch
        ).toHaveBeenCalledWith(
          "2026-07-15",
          "2026-07-18"
        );
      }
    );

    it(
      "aplica o preset dos próximos 7 dias",
      () => {
        render(
          <NeoDateRangeFilter
            {...defaultProps}
          />
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Próximos 7 dias",
            }
          )
        );

        expect(
          defaultProps
            .onStartDateChange
        ).toHaveBeenCalledWith(
          "2026-07-15"
        );

        expect(
          defaultProps
            .onEndDateChange
        ).toHaveBeenCalledWith(
          "2026-07-22"
        );

        expect(
          defaultProps.onSearch
        ).toHaveBeenCalledWith(
          "2026-07-15",
          "2026-07-22"
        );
      }
    );

    it(
      "executa a pesquisa com o intervalo atual",
      () => {
        render(
          <NeoDateRangeFilter
            {...defaultProps}
          />
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Pesquisar objetos",
            }
          )
        );

        expect(
          defaultProps.onSearch
        ).toHaveBeenCalledWith(
          "2026-07-15",
          "2026-07-18"
        );
      }
    );

    it(
      "ajusta automaticamente um intervalo superior ao limite",
      () => {
        render(
          <NeoDateRangeFilter
            {...defaultProps}
            endDate="2026-07-30"
          />
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Pesquisar objetos",
            }
          )
        );

        expect(
          defaultProps
            .onEndDateChange
        ).toHaveBeenCalledWith(
          "2026-07-22"
        );

        expect(
          defaultProps.onSearch
        ).toHaveBeenCalledWith(
          "2026-07-15",
          "2026-07-22"
        );

        expect(
          screen.getByRole(
            "alert"
          )
        ).toHaveTextContent(
          "O intervalo máximo permitido pela API é de 7 dias. A data final foi ajustada."
        );
      }
    );

    it(
      "ajusta a data final quando a data inicial provoca um intervalo excessivo",
      () => {
        render(
          <NeoDateRangeFilter
            {...defaultProps}
            startDate="2026-07-01"
            endDate="2026-07-20"
          />
        );

        fireEvent.change(
          screen.getByLabelText(
            "Data inicial"
          ),
          {
            target: {
              value:
                "2026-07-05",
            },
          }
        );

        expect(
          defaultProps
            .onStartDateChange
        ).toHaveBeenCalledWith(
          "2026-07-05"
        );

        expect(
          defaultProps
            .onEndDateChange
        ).toHaveBeenCalledWith(
          "2026-07-12"
        );
      }
    );

    it(
      "mantém a data final quando o intervalo é válido",
      () => {
        render(
          <NeoDateRangeFilter
            {...defaultProps}
          />
        );

        fireEvent.change(
          screen.getByLabelText(
            "Data final"
          ),
          {
            target: {
              value:
                "2026-07-20",
            },
          }
        );

        expect(
          defaultProps
            .onEndDateChange
        ).toHaveBeenCalledWith(
          "2026-07-20"
        );

        expect(
          screen.queryByRole(
            "alert"
          )
        ).not.toBeInTheDocument();
      }
    );

    it(
      "desativa os controlos durante o carregamento",
      () => {
        render(
          <NeoDateRangeFilter
            {...defaultProps}
            loading
          />
        );

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "A pesquisar...",
            }
          )
        ).toBeDisabled();

        expect(
          screen.getByRole(
            "button",
            {
              name: "Hoje",
            }
          )
        ).toBeDisabled();

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Próximos 3 dias",
            }
          )
        ).toBeDisabled();

        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Próximos 7 dias",
            }
          )
        ).toBeDisabled();

        expect(
          screen.getByLabelText(
            "Data inicial"
          )
        ).toBeDisabled();

        expect(
          screen.getByLabelText(
            "Data final"
          )
        ).toBeDisabled();
      }
    );

    it(
      "define hoje como mínimo da data inicial",
      () => {
        render(
          <NeoDateRangeFilter
            {...defaultProps}
          />
        );

        expect(
          screen.getByLabelText(
            "Data inicial"
          )
        ).toHaveAttribute(
          "min",
          "2026-07-15"
        );
      }
    );

    it(
      "define a data inicial como mínimo da data final",
      () => {
        render(
          <NeoDateRangeFilter
            {...defaultProps}
          />
        );

        expect(
          screen.getByLabelText(
            "Data final"
          )
        ).toHaveAttribute(
          "min",
          "2026-07-15"
        );
      }
    );
  }
);