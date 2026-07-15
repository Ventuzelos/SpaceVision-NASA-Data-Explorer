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

import NeoDateRangeFilter from "./NeoDateRangeFilter";

vi.mock("../../../services/neowsService", () => ({
    MAX_RANGE_DAYS: 7,

    clampDateRange: vi.fn(
        (startDate, endDate) => {
            const start = new Date(
                `${startDate}T00:00:00`
            );

            const end = new Date(
                `${endDate}T00:00:00`
            );

            const maximumEnd = new Date(start);

            maximumEnd.setDate(
                maximumEnd.getDate() + 7
            );

            if (end > maximumEnd) {
                return {
                    startDate,
                    endDate: maximumEnd
                        .toISOString()
                        .split("T")[0],
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
}));

describe("NeoDateRangeFilter", () => {
    const defaultProps = {
        startDate: "2026-07-15",
        endDate: "2026-07-18",
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

    it("apresenta as datas selecionadas", () => {
        render(
            <NeoDateRangeFilter {...defaultProps} />
        );

        expect(
            screen.getByLabelText("Data inicial")
        ).toHaveValue("2026-07-15");

        expect(
            screen.getByLabelText("Data final")
        ).toHaveValue("2026-07-18");
    });

    it("aplica o preset de hoje", () => {
        render(
            <NeoDateRangeFilter {...defaultProps} />
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Hoje",
            })
        );

        expect(
            defaultProps.onStartDateChange
        ).toHaveBeenCalledWith("2026-07-15");

        expect(
            defaultProps.onEndDateChange
        ).toHaveBeenCalledWith("2026-07-15");

        expect(
            defaultProps.onSearch
        ).toHaveBeenCalledWith(
            "2026-07-15",
            "2026-07-15"
        );
    });

    it("aplica o preset dos próximos 3 dias", () => {
        render(
            <NeoDateRangeFilter {...defaultProps} />
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Próximos 3 dias",
            })
        );

        expect(
            defaultProps.onStartDateChange
        ).toHaveBeenCalledWith("2026-07-15");

        expect(
            defaultProps.onEndDateChange
        ).toHaveBeenCalledWith("2026-07-18");

        expect(
            defaultProps.onSearch
        ).toHaveBeenCalledWith(
            "2026-07-15",
            "2026-07-18"
        );
    });

    it("executa a pesquisa com o intervalo atual", () => {
        render(
            <NeoDateRangeFilter {...defaultProps} />
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Pesquisar objetos",
            })
        );

        expect(
            defaultProps.onSearch
        ).toHaveBeenCalledWith(
            "2026-07-15",
            "2026-07-18"
        );
    });

    it("ajusta automaticamente um intervalo superior ao limite", () => {
        render(
            <NeoDateRangeFilter
                {...defaultProps}
                endDate="2026-07-30"
            />
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Pesquisar objetos",
            })
        );

        expect(
            defaultProps.onEndDateChange
        ).toHaveBeenCalledWith("2026-07-21");

        expect(
            defaultProps.onSearch
        ).toHaveBeenCalledWith(
            "2026-07-15",
            "2026-07-21"
        );

        expect(
            screen.getByRole("alert")
        ).toHaveTextContent(
            "O intervalo máximo permitido pela API é de 7 dias. Ajustámos a data final."
        );
    });

    it("ajusta a data final quando a data inicial provoca um intervalo excessivo", () => {
        render(
            <NeoDateRangeFilter
                {...defaultProps}
                startDate="2026-07-01"
                endDate="2026-07-20"
            />
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

        expect(
            defaultProps.onEndDateChange
        ).toHaveBeenCalledWith("2026-07-11");
    });

    it("mantém a data final quando o intervalo é válido", () => {
        render(
            <NeoDateRangeFilter {...defaultProps} />
        );

        fireEvent.change(
            screen.getByLabelText("Data final"),
            {
                target: {
                    value: "2026-07-20",
                },
            }
        );

        expect(
            defaultProps.onEndDateChange
        ).toHaveBeenCalledWith("2026-07-20");

        expect(
            screen.queryByRole("alert")
        ).not.toBeInTheDocument();
    });

    it("desativa os botões durante o carregamento", () => {
        render(
            <NeoDateRangeFilter
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
                name: "Hoje",
            })
        ).toBeDisabled();

        expect(
            screen.getByRole("button", {
                name: "Próximos 3 dias",
            })
        ).toBeDisabled();
    });

    it("define a data inicial como mínimo da data final", () => {
        render(
            <NeoDateRangeFilter {...defaultProps} />
        );

        expect(
            screen.getByLabelText("Data final")
        ).toHaveAttribute(
            "min",
            "2026-07-15"
        );
    });
});