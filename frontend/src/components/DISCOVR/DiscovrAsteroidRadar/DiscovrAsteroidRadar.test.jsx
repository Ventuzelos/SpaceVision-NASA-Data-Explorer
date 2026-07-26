import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import DiscovrAsteroidRadar from "./DiscovrAsteroidRadar";
import useAuth from "../../../hooks/useAuth";
import {
  fetchNeoFeed,
  sortByMissDistance,
} from "../../../services/neowsService";
import {
  getFavorites,
  toggleFavorite,
} from "../../../services/favoritesService";

vi.mock("../../../hooks/useAuth", () => ({
  default: vi.fn(),
}));

vi.mock("../../../services/neowsService", () => ({
  fetchNeoFeed: vi.fn(),
  getDefaultDateRange: vi.fn(() => ({
    startDate: "2026-07-26",
    endDate: "2026-08-02",
  })),
  sortByMissDistance: vi.fn((objects) => objects),
}));

vi.mock("../../../services/favoritesService", () => ({
  getFavorites: vi.fn(),
  toggleFavorite: vi.fn(),
}));

const ASTEROID = {
  id: "3645200",
  name: "(2013 OD4)",
  missDistanceKm: 42510615.087,
  diameterMinKm: 0.1646474378,
  diameterMaxKm: 0.3681628631,
};

function renderRadar() {
  return render(
    <MemoryRouter>
      <DiscovrAsteroidRadar />
    </MemoryRouter>
  );
}

describe("DiscovrAsteroidRadar", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useAuth.mockReturnValue({
      isAuthenticated: false,
      isAuthLoading: false,
    });

    fetchNeoFeed.mockResolvedValue({
      elementCount: 1,
      startDate: "2026-07-26",
      endDate: "2026-08-02",
      objects: [ASTEROID],
    });
  });

  it("ordena a lista de objetos devolvida pela API, não a resposta inteira", async () => {
    renderRadar();

    await screen.findByText("(2013 OD4)");

    expect(sortByMissDistance).toHaveBeenCalledWith([ASTEROID]);
  });

  it("mostra a distância e o diâmetro a partir dos campos normalizados", async () => {
    renderRadar();

    expect(
      await screen.findByText(/42\s510\s615\skm/)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/165\s–\s368\sm/)
    ).toBeInTheDocument();
  });

  it("não pede favoritos a um utilizador sem sessão iniciada", async () => {
    renderRadar();

    await screen.findByText("(2013 OD4)");

    expect(getFavorites).not.toHaveBeenCalled();
  });

  it("marca como favorito um asteroide cujo nasa_id corresponde ao guardado", async () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      isAuthLoading: false,
    });

    getFavorites.mockResolvedValue([
      { nasa_id: "3645200" },
    ]);

    renderRadar();

    await screen.findByText("(2013 OD4)");

    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-pressed",
        "true"
      );
    });
  });

  it("envia o objeto correto ao alternar o favorito e atualiza o estado a partir da resposta", async () => {
    const user = userEvent.setup();

    useAuth.mockReturnValue({
      isAuthenticated: true,
      isAuthLoading: false,
    });

    getFavorites.mockResolvedValue([]);
    toggleFavorite.mockResolvedValue({
      isFavorite: true,
      favorite: { id: 99 },
    });

    renderRadar();

    const favoriteButton = await screen.findByRole("button");

    expect(favoriteButton).toHaveAttribute("aria-pressed", "false");

    await user.click(favoriteButton);

    await waitFor(() => {
      expect(toggleFavorite).toHaveBeenCalledWith({
        nasa_type: "neows",
        nasa_id: "3645200",
        title: "(2013 OD4)",
        data: ASTEROID,
      });
    });

    expect(favoriteButton).toHaveAttribute("aria-pressed", "true");
  });
});
