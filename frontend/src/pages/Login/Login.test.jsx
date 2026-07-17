import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import Login from "./Login";
import useAuth from "../../hooks/useAuth";

vi.mock(
"../../components/common/GalaxyBackground/GalaxyBackground",
  () => ({
  default: () => null,
})
);

vi.mock("../../hooks/useAuth", () => ({
  default: vi.fn(),
}));

function LocationDisplay() {
  const location = useLocation();

  return (
    <p data-testid="current-location">
      {location.pathname}
    </p>
  );
}

function renderLogin(initialEntries = ["/login"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/"
          element={
            <>
              <p>Página inicial</p>
              <LocationDisplay />
            </>
          }
        />

        <Route
          path="/admin"
          element={
            <>
              <p>Painel de administração</p>
              <LocationDisplay />
            </>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

async function fillLoginForm(
  user,
  email = "angela@example.com",
  password = "Password123"
) {
  await user.type(
    screen.getByLabelText("Email"),
    email
  );

  await user.type(
    screen.getByLabelText("Palavra-passe"),
    password
  );
}

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("faz login e redireciona o utilizador normal para a página inicial", async () => {
    const user = userEvent.setup();

    const login = vi.fn().mockResolvedValue({
      id: 1,
      name: "Ângela Pereira",
      email: "angela@example.com",
      role: "user",
    });

    useAuth.mockReturnValue({
      login,
    });

    renderLogin();

    await fillLoginForm(user);

    await user.click(
      screen.getByRole("button", {
        name: "Entrar",
      })
    );

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: "angela@example.com",
        password: "Password123",
      });
    });

    expect(
      await screen.findByText("Página inicial")
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("current-location")
    ).toHaveTextContent("/");
  });

  it("redireciona o administrador para o painel de administração", async () => {
    const user = userEvent.setup();

    const login = vi.fn().mockResolvedValue({
      id: 2,
      name: "Administradora",
      email: "admin@example.com",
      role: "admin",
    });

    useAuth.mockReturnValue({
      login,
    });

    renderLogin();

    await fillLoginForm(
      user,
      "admin@example.com",
      "Password123"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Entrar",
      })
    );

    expect(
      await screen.findByText(
        "Painel de administração"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("current-location")
    ).toHaveTextContent("/admin");
  });

  it("apresenta a mensagem de erro devolvida pela API", async () => {
    const user = userEvent.setup();

    const login = vi.fn().mockRejectedValue({
      response: {
        data: {
          errors: {
            email: [
              "Os dados de acesso estão incorretos.",
            ],
          },
        },
      },
    });

    useAuth.mockReturnValue({
      login,
    });

    renderLogin();

    await fillLoginForm(
      user,
      "angela@example.com",
      "PasswordErrada"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Entrar",
      })
    );

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(
      "Os dados de acesso estão incorretos."
    );

    expect(
      screen.getByRole("button", {
        name: "Entrar",
      })
    ).not.toBeDisabled();
  });

  it("desativa o botão enquanto o login está em curso", async () => {
    const user = userEvent.setup();

    let resolveLogin;

    const pendingLogin = new Promise((resolve) => {
      resolveLogin = resolve;
    });

    const login = vi
      .fn()
      .mockReturnValue(pendingLogin);

    useAuth.mockReturnValue({
      login,
    });

    renderLogin();

    await fillLoginForm(user);

    await user.click(
      screen.getByRole("button", {
        name: "Entrar",
      })
    );

    expect(
      screen.getByRole("button", {
        name: "A entrar...",
      })
    ).toBeDisabled();

    resolveLogin({
      id: 1,
      name: "Ângela Pereira",
      email: "angela@example.com",
      role: "user",
    });

    expect(
      await screen.findByText("Página inicial")
    ).toBeInTheDocument();
  });
});