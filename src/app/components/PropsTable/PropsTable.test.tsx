import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PropsTable } from "./PropsTable";
import { Alternate, Prop } from "./types";

const mockProps: Prop[] = [
  {
    playerName: "LeBron James",
    playerId: 1,
    teamId: 1,
    teamNickname: "Lakers",
    teamAbbr: "LAL",
    statType: "points",
    statTypeId: 100,
    position: "SF",
    marketSuspended: 0,
    line: 25.5,
  },
  {
    playerName: "Stephen Curry",
    playerId: 2,
    teamId: 2,
    teamNickname: "Warriors",
    teamAbbr: "GSW",
    statType: "assists",
    statTypeId: 102,
    position: "PG",
    marketSuspended: 0,
    line: 6.5,
  },
];

const mockAlternates: Alternate[] = [
  {
    playerName: "LeBron James",
    playerId: 1,
    statType: "points",
    statTypeId: 100,
    line: 24.5,
    underOdds: 0.45,
    overOdds: 0.55,
    pushOdds: 0,
  },
  {
    playerName: "LeBron James",
    playerId: 1,
    statType: "points",
    statTypeId: 100,
    line: 25.5,
    underOdds: 0.5,
    overOdds: 0.5,
    pushOdds: 0,
  },
  {
    playerName: "LeBron James",
    playerId: 1,
    statType: "points",
    statTypeId: 100,
    line: 26.5,
    underOdds: 0.55,
    overOdds: 0.45,
    pushOdds: 0,
  },
  {
    playerName: "Stephen Curry",
    playerId: 2,
    statType: "assists",
    statTypeId: 102,
    line: 6.5,
    underOdds: 0.48,
    overOdds: 0.52,
    pushOdds: 0,
  },
];

describe("PropsTable", () => {
  const mockIsManuallySuspended = jest.fn();
  const mockOnManualSuspend = jest.fn();

  beforeEach(() => {
    mockIsManuallySuspended.mockClear();
    mockOnManualSuspend.mockClear();
  });

  it("renders the table with correct headers", () => {
    render(
      <PropsTable
        filteredProps={mockProps}
        alternates={mockAlternates}
        isManuallySuspended={mockIsManuallySuspended}
        onManualSuspend={mockOnManualSuspend}
      />
    );

    const headers = screen.getAllByRole("columnheader");

    expect(headers).toHaveLength(9);
    expect(headers[0]).toHaveTextContent(/player/i);
    expect(headers[1]).toHaveTextContent(/team/i);
    expect(headers[2]).toHaveTextContent(/position/i);
    expect(headers[3]).toHaveTextContent(/stat type/i);
    expect(headers[4]).toHaveTextContent(/optimal line/i);
    expect(headers[5]).toHaveTextContent(/low line/i);
    expect(headers[6]).toHaveTextContent(/high line/i);
    expect(headers[7]).toHaveTextContent(/suspended/i);
    expect(headers[8]).toHaveTextContent(/manual suspend/i);
  });

  it("displays correct data for each player", () => {
    render(
      <PropsTable
        filteredProps={mockProps}
        alternates={mockAlternates}
        isManuallySuspended={mockIsManuallySuspended}
        onManualSuspend={mockOnManualSuspend}
      />
    );

    mockProps.forEach((prop) => {
      const row = screen.getByRole("row", {
        name: new RegExp(prop.playerName, "i"),
      });
      const cells = within(row).getAllByRole("cell");

      expect(
        within(row).getByRole("rowheader", { name: prop.playerName })
      ).toBeInTheDocument();
      expect(cells[0]).toHaveTextContent(prop.teamAbbr);
      expect(cells[1]).toHaveTextContent(prop.position);
      expect(cells[2]).toHaveTextContent(prop.statType);
      expect(cells[3]).toHaveTextContent(prop.line.toString()); // Optimal Line
    });
  });

  it("calculates and displays correct low and high lines", () => {
    render(
      <PropsTable
        filteredProps={mockProps}
        alternates={mockAlternates}
        isManuallySuspended={mockIsManuallySuspended}
        onManualSuspend={mockOnManualSuspend}
      />
    );

    const lebronRow = screen.getByRole("row", { name: /LeBron James/i });
    expect(
      within(lebronRow).getByRole("cell", { name: "24.5" })
    ).toBeInTheDocument(); // Low line
    expect(
      within(lebronRow).getByRole("cell", { name: "26.5" })
    ).toBeInTheDocument(); // High line

    const curryRow = screen.getByRole("row", { name: /Stephen Curry/i });
    const cells = within(curryRow).getAllByRole("cell");
    expect(cells[3]).toHaveTextContent("6.5"); // Optimal Line
    expect(cells[4]).toHaveTextContent("6.5"); // Low Line
    expect(cells[5]).toHaveTextContent("6.5"); // High Line
  });

  it("handles manual suspension toggle", async () => {
    const user = userEvent.setup();

    render(
      <PropsTable
        filteredProps={mockProps}
        alternates={mockAlternates}
        isManuallySuspended={mockIsManuallySuspended}
        onManualSuspend={mockOnManualSuspend}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);

    expect(mockOnManualSuspend).toHaveBeenCalledWith(
      mockProps[0].playerId,
      mockProps[0].statTypeId
    );
  });
});
