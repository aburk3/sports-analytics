import React from "react";
import { render, screen } from "@testing-library/react";
import { FilterBar } from "./FilterBar";

describe("FilterBar", () => {
  it("renders all filter inputs", () => {
    render(
      <FilterBar
        searchTerm=""
        positionFilter=""
        statTypeFilter=""
        marketStatusFilter=""
        onSearchChange={() => {}}
        onPositionFilterChange={() => {}}
        onStatTypeFilterChange={() => {}}
        onMarketStatusFilterChange={() => {}}
      />
    );

    // Query for textbox (search input)
    expect(
      screen.getByRole("textbox", { name: /search/i })
    ).toBeInTheDocument();

    // Query for comboboxes (select inputs)
    const comboboxes = screen.getAllByRole("combobox");
    expect(comboboxes).toHaveLength(3); // Position, Stat Type, and Market Status

    expect(comboboxes[0]).toHaveAccessibleName(/position/i);
    expect(comboboxes[1]).toHaveAccessibleName(/stat type/i);
    expect(comboboxes[2]).toHaveAccessibleName(/market status/i);
  });
});
