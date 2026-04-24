import { render, screen } from "@testing-library/react";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import ScenarioSelector from "../ScenarioComparison/ScenarioSelector";

describe("ScenarioSelector", () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it("renders preset buttons for retirement ages: 62, 65, 67, 70", async () => {
    const handleSelect = vi.fn();
    render(<ScenarioSelector onSelectScenario={handleSelect} />);

    expect(screen.getByRole("button", { name: /62/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /65/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /67/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /70/i })).toBeInTheDocument();
  });

  it("renders custom input field for retirement age", async () => {
    const handleSelect = vi.fn();
    render(<ScenarioSelector onSelectScenario={handleSelect} />);

    expect(screen.getByPlaceholderText(/Enter retirement age/i)).toBeInTheDocument();
  });

  it("calls onSelectScenario with retirement age when preset button is clicked", async () => {
    const handleSelect = vi.fn();
    render(<ScenarioSelector onSelectScenario={handleSelect} />);

    const button62 = screen.getByRole("button", { name: /62/i });
    await user.click(button62);

    expect(handleSelect).toHaveBeenCalledWith(62);
  });

  it("calls onSelectScenario with retirement age when custom input changes", async () => {
    const handleSelect = vi.fn();
    render(<ScenarioSelector onSelectScenario={handleSelect} />);

    const input = screen.getByPlaceholderText(/Enter retirement age/i);
    
    await user.type(input, "65");

    expect(handleSelect).toHaveBeenCalledWith(65);
  });

  it("calls onSelectScenario with valid custom value (70)", async () => {
    const handleSelect = vi.fn();
    render(<ScenarioSelector onSelectScenario={handleSelect} />);

    const input = screen.getByPlaceholderText(/Enter retirement age/i);
    
    await user.type(input, "70");

    expect(handleSelect).toHaveBeenCalledWith(70);
  });

  it("displays the custom input with appropriate styling", async () => {
    const handleSelect = vi.fn();
    render(<ScenarioSelector onSelectScenario={handleSelect} />);

    const input = screen.getByPlaceholderText(/Enter retirement age/i);
    
    expect(input).toHaveAttribute("type", "number");
    expect(input).toHaveAttribute("min", "62");
    expect(input).toHaveAttribute("max", "100");
  });
});
