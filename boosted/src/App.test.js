import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders financing banner text", () => {
  render(<App />);
  const text = screen.getByText(/Financing option available at checkout./i);
  expect(text).toBeInTheDocument();
});
