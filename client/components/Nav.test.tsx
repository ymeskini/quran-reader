import { test, expect, mock } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";
import { Nav } from "./Nav";

test("renders forward and backward buttons", () => {
  render(<Nav page={1} onNavigate={() => {}} />);
  const buttons = screen.getAllByRole("button");
  expect(buttons).toHaveLength(2);
  expect(buttons[0]).toHaveTextContent("→");
  expect(buttons[1]).toHaveTextContent("←");
});

test("renders input with current page value", () => {
  render(<Nav page={42} onNavigate={() => {}} />);
  const input = screen.getByRole("spinbutton");
  expect(input).toHaveValue(42);
});

test("disables backward button on page 1", () => {
  render(<Nav page={1} onNavigate={() => {}} />);
  const buttons = screen.getAllByRole("button");
  expect(buttons[1]).toBeDisabled();
});

test("disables forward button on page 604", () => {
  render(<Nav page={604} onNavigate={() => {}} />);
  const buttons = screen.getAllByRole("button");
  expect(buttons[0]).toBeDisabled();
});

test("calls onNavigate with next page on forward click", () => {
  const onNavigate = mock(() => {});
  render(<Nav page={5} onNavigate={onNavigate} />);
  fireEvent.click(screen.getAllByRole("button")[0]);
  expect(onNavigate).toHaveBeenCalledWith(6);
});

test("calls onNavigate with previous page on backward click", () => {
  const onNavigate = mock(() => {});
  render(<Nav page={5} onNavigate={onNavigate} />);
  fireEvent.click(screen.getAllByRole("button")[1]);
  expect(onNavigate).toHaveBeenCalledWith(4);
});

test("calls onNavigate on Enter key in input", () => {
  const onNavigate = mock(() => {});
  render(<Nav page={1} onNavigate={onNavigate} />);
  const input = screen.getByRole("spinbutton");
  fireEvent.change(input, { target: { value: "100" } });
  fireEvent.keyDown(input, { key: "Enter" });
  expect(onNavigate).toHaveBeenCalledWith(100);
});

test("calls onNavigate on input blur", () => {
  const onNavigate = mock(() => {});
  render(<Nav page={1} onNavigate={onNavigate} />);
  const input = screen.getByRole("spinbutton");
  fireEvent.change(input, { target: { value: "50" } });
  fireEvent.blur(input);
  expect(onNavigate).toHaveBeenCalledWith(50);
});

test("clamps page value to valid range", () => {
  const onNavigate = mock(() => {});
  render(<Nav page={1} onNavigate={onNavigate} />);
  const input = screen.getByRole("spinbutton");
  fireEvent.change(input, { target: { value: "999" } });
  fireEvent.keyDown(input, { key: "Enter" });
  expect(onNavigate).toHaveBeenCalledWith(604);
});
