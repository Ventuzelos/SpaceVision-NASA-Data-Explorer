import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Pagination from "./Pagination";

describe("Pagination", () => {
  it("não apresenta paginação quando existe apenas uma página", () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("desativa o botão anterior na primeira página", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={() => {}}
      />
    );

    expect(
      screen.getByRole("button", {
        name: "Página anterior",
      })
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "Página seguinte",
      })
    ).not.toBeDisabled();
  });

  it("desativa o botão seguinte na última página", () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={() => {}}
      />
    );

    expect(
      screen.getByRole("button", {
        name: "Página seguinte",
      })
    ).toBeDisabled();
  });

it("chama onPageChange com a página selecionada", () => {
  const handlePageChange = vi.fn();

  render(
    <Pagination
      currentPage={1}
      totalPages={5}
      onPageChange={handlePageChange}
    />
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: "2",
    })
  );

  expect(handlePageChange).toHaveBeenCalledWith(2);
});

  it("identifica a página atual através de aria-current", () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={() => {}}
      />
    );

    expect(
      screen.getByRole("button", {
        name: "2",
      })
    ).toHaveAttribute("aria-current", "page");
  });
});