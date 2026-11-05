import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { SessionStatus } from "./session-status";

test("SessionStatus con sesión muestra «Sesión iniciada como ana@test.com»", () => {
  render(<SessionStatus email="ana@test.com" />);

  expect(screen.getByText("Sesión iniciada como ana@test.com")).toBeDefined();
});
