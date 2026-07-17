import {
  render,
  screen,
} from "@testing-library/react";
import {
  MemoryRouter,
  Route,
  Routes,
} from "react-router-dom";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import Admin from "./Admin";
import useAuth from "../../hooks/useAuth";

vi.mock("../../hooks/useAuth", () => ({
  default: vi.fn(),
}));

vi.mock("../../services/adminService", () => ({
  getUsersStats: vi.fn().mockResolvedValue({
    total: 0,
    newLastMonth: 0,
  }),
  getFavoritesStats: vi.fn().mockResolvedValue({
    total: 0,
    byCategory: [],
    topSaved: [],
  }),
  getMessagesStats: vi.fn().mockResolvedValue({
    total: 0,
    unread: 0,
    messages: [],
  }),
  markMessageAsRead: vi.fn(),
  deleteMessage: vi.fn(),
}));

function renderAdmin() {
  return render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route
          path="/admin"
          element={<Admin />}
        />

        <Route
          path="/login"
          element={<p>Página de login</p>}
        />

        <Route
          path="/"
          element={<p>Página inicial</p>}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("Admin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("apresenta o estado de carregamento da autenticação", () => {
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      isAuthLoading: true,
    });

    renderAdmin();

    expect(
      screen.getByText("A carregar painel...")
    ).toBeInTheDocument();
  });

  it("redireciona utilizadores não autenticados para o login", async () => {
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      isAuthLoading: false,
    });

    renderAdmin();

    expect(
      await screen.findByText("Página de login")
    ).toBeInTheDocument();
  });

  it("redireciona utilizadores normais para a página inicial", async () => {
    useAuth.mockReturnValue({
      user: {
        id: 1,
        name: "Utilizador",
        role: "user",
      },
      isAuthenticated: true,
      isAdmin: false,
      isAuthLoading: false,
    });

    renderAdmin();

    expect(
      await screen.findByText("Página inicial")
    ).toBeInTheDocument();
  });

  it("permite ao administrador visualizar o painel", async () => {
    useAuth.mockReturnValue({
      user: {
        id: 2,
        name: "Ângela",
        role: "admin",
      },
      isAuthenticated: true,
      isAdmin: true,
      isAuthLoading: false,
    });

    renderAdmin();

    expect(
      await screen.findByRole("heading", {
        name: "Painel de administração",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Bem-vinda, Ângela!")
    ).toBeInTheDocument();
  });
});