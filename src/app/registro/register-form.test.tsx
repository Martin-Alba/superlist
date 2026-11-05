import { expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { RegisterForm } from "./register-form";

function descriptionOf(field: HTMLElement) {
  const id = field.getAttribute("aria-describedby");
  return id ? document.getElementById(id)?.textContent : undefined;
}

test("el formulario muestra cada error junto a su campo", async () => {
  const action = async () => ({
    errors: {
      email: "Introduce un email válido",
      password: "La contraseña debe tener al menos 8 caracteres",
    },
  });
  render(<RegisterForm action={action} />);

  fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));

  await screen.findByText("Introduce un email válido");
  expect(descriptionOf(screen.getByLabelText("Email"))).toBe(
    "Introduce un email válido",
  );
  expect(descriptionOf(screen.getByLabelText("Contraseña"))).toBe(
    "La contraseña debe tener al menos 8 caracteres",
  );
});
