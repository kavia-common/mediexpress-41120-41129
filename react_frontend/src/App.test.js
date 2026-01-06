import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders brand and catalog entry points", () => {
  render(<App />);
  expect(screen.getByText(/MediExpress/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Search/i })).toBeInTheDocument();
});
