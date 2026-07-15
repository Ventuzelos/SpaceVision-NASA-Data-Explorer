import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SearchInput from "./SearchInput";

describe("SearchInput", () => {
  it("apresenta o placeholder predefinido", () => {
    render(
      <SearchInput
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
      />
    );

    expect(
      screen.getByPlaceholderText(
        "Pesquisar imagens, missões ou planetas..."
      )
    ).toBeInTheDocument();
  });

  it("executa onChange quando o valor do campo muda", () => {
    const handleChange = vi.fn();

    render(
      <SearchInput
        value=""
        onChange={handleChange}
        onSubmit={() => {}}
      />
    );

    fireEvent.change(
      screen.getByRole("textbox"),
      {
        target: {
          value: "asteroides",
        },
      }
    );

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("envia o valor atual ao submeter a pesquisa", () => {
    const handleSubmit = vi.fn();

    render(
      <SearchInput
        value="APOD"
        onChange={() => {}}
        onSubmit={handleSubmit}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Pesquisar",
      })
    );

    expect(handleSubmit).toHaveBeenCalledWith("APOD");
  });

  it("permite utilizar um placeholder personalizado", () => {
    render(
      <SearchInput
        placeholder="Pesquisar eventos solares"
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
      />
    );

    expect(
      screen.getByPlaceholderText(
        "Pesquisar eventos solares"
      )
    ).toBeInTheDocument();
  });
});