import React from "react";
import MenuItem from "@mui/material/MenuItem";
import { FilterContainer, CustomTextField } from "./styles";

interface FilterBarProps {
  searchTerm: string;
  positionFilter: string;
  statTypeFilter: string;
  marketStatusFilter: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPositionFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onStatTypeFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onMarketStatusFilterChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  positionFilter,
  statTypeFilter,
  marketStatusFilter,
  onSearchChange,
  onPositionFilterChange,
  onStatTypeFilterChange,
  onMarketStatusFilterChange,
}) => (
  <FilterContainer>
    <CustomTextField
      label="Search"
      variant="outlined"
      value={searchTerm}
      onChange={onSearchChange}
      placeholder="Search by player name or team"
    />
    <CustomTextField
      label="Position"
      variant="outlined"
      select
      value={positionFilter}
      onChange={onPositionFilterChange}
    >
      <MenuItem value="">All</MenuItem>
      <MenuItem value="PG">PG</MenuItem>
      <MenuItem value="SG">SG</MenuItem>
      <MenuItem value="SF">SF</MenuItem>
      <MenuItem value="PF">PF</MenuItem>
      <MenuItem value="C">C</MenuItem>
    </CustomTextField>
    <CustomTextField
      label="Stat Type"
      variant="outlined"
      select
      value={statTypeFilter}
      onChange={onStatTypeFilterChange}
    >
      <MenuItem value="">All</MenuItem>
      <MenuItem value="points">Points</MenuItem>
      <MenuItem value="rebounds">Rebounds</MenuItem>
      <MenuItem value="assists">Assists</MenuItem>
      <MenuItem value="steals">Steals</MenuItem>
    </CustomTextField>
    <CustomTextField
      label="Market Status"
      variant="outlined"
      select
      value={marketStatusFilter}
      onChange={onMarketStatusFilterChange}
    >
      <MenuItem value="">All</MenuItem>
      <MenuItem value="suspended">Suspended</MenuItem>
      <MenuItem value="active">Active</MenuItem>
    </CustomTextField>
  </FilterContainer>
);
