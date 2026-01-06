import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders MediExpress brand", () => {
  render(<App />);
  const brand = screen.getByText(/MediExpress/i);
  expect(brand).toBeInTheDocument();
});
