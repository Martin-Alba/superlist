import { afterEach, expect, test, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { RegisterForm } from "./register-form";

// Sin `globals` en Vitest, Testing Library no limpia el DOM entre tests.
afterEach(cleanup);

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

test("el formulario envía al servidor un email mal formado, sin que lo bloquee el navegador", async () => {
  const action = vi.fn(async () => ({}));
  render(<RegisterForm action={action} />);

  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "sin-arroba" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));

  await waitFor(() => expect(action).toHaveBeenCalledTimes(1));
});
