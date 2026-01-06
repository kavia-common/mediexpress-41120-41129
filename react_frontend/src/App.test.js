import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders MedExpress navbar", () => {
  render(<App />);
  const brand = screen.getByText(/MedExpress/i);
  expect(brand).toBeInTheDocument();
});
