import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Jashmedicine navbar", () => {
  render(<App />);
  const brand = screen.getByText(/Jashmedicine/i);
  expect(brand).toBeInTheDocument();
});
