import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import FavoriteButton from "./FavoriteButton";

describe("FavoriteButton", () => {
  it("apresenta o botão como não ativo por defeito", () => {
    render(
      <FavoriteButton
        ariaLabel="Adicionar aos favoritos"
        onClick={() => {}}
      />
    );

    const button = screen.getByRole("button", {
      name: "Adicionar aos favoritos",
    });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).not.toHaveClass("favorite-button--active");
  });

  it("apresenta o estado ativo quando active é verdadeiro", () => {
    render(
      <FavoriteButton
        active
        ariaLabel="Remover dos favoritos"
        onClick={() => {}}
      />
    );

    const button = screen.getByRole("button", {
      name: "Remover dos favoritos",
    });

    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveClass("favorite-button--active");
  });

  it("executa onClick quando o utilizador clica", () => {
    const handleClick = vi.fn();

    render(
      <FavoriteButton
        ariaLabel="Adicionar aos favoritos"
        onClick={handleClick}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Adicionar aos favoritos",
      })
    );

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});