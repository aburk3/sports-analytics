// Page.tsx
"use client";

import React, { useCallback, useState, useEffect } from "react";
import { debounce } from "lodash";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "./page.module.css";
import { FilterBar } from "./components/FilterBar/FilterBar";
import { PropsTable } from "./components/PropsTable/PropsTable";
import useAlternates from "./hooks/useAlternates";
import useProps from "./hooks/useProps";
import useFilteredProps from "./hooks/useFilteredProps";
import { LoadingContainer } from "./styles";

const API_BASE_URL = "http://localhost";

function Page() {
  const [manualSuspendedMarkets, setManualSuspendedMarkets] = useState<
    Set<string>
  >(new Set());
  const [positionFilter, setPositionFilter] = useState<string>("");
  const [statTypeFilter, setStatTypeFilter] = useState<string>("");
  const [marketStatusFilter, setMarketStatusFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  const { alternates, alternatesLoading } = useAlternates(API_BASE_URL);
  const { props, propsLoading } = useProps(API_BASE_URL);
  const filteredProps = useFilteredProps(
    props,
    alternates,
    positionFilter,
    statTypeFilter,
    marketStatusFilter,
    debouncedSearchTerm,
    manualSuspendedMarkets
  );

  const isLoading = alternatesLoading || propsLoading;

  const isManuallySuspended = useCallback(
    (playerId: number, statTypeId: number) => {
      return manualSuspendedMarkets.has(`${playerId}-${statTypeId}`);
    },
    [manualSuspendedMarkets]
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Debounce effect for search term
  useEffect(() => {
    const debouncedSearch = debounce(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm]);

  const handleManualSuspend = (playerId: number, statTypeId: number) => {
    const marketKey = `${playerId}-${statTypeId}`;
    setManualSuspendedMarkets((prevState) => {
      const newSet = new Set(prevState);
      if (newSet.has(marketKey)) {
        newSet.delete(marketKey);
      } else {
        newSet.add(marketKey);
      }
      return newSet;
    });
  };

  return (
    <main className={styles.main}>
      <FilterBar
        searchTerm={searchTerm}
        positionFilter={positionFilter}
        statTypeFilter={statTypeFilter}
        marketStatusFilter={marketStatusFilter}
        onSearchChange={handleSearchChange}
        onPositionFilterChange={(e) => setPositionFilter(e.target.value)}
        onStatTypeFilterChange={(e) => setStatTypeFilter(e.target.value)}
        onMarketStatusFilterChange={(e) =>
          setMarketStatusFilter(e.target.value)
        }
      />
      {isLoading ? (
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      ) : filteredProps.length > 0 ? (
        <PropsTable
          filteredProps={filteredProps}
          alternates={alternates}
          isManuallySuspended={isManuallySuspended}
          onManualSuspend={handleManualSuspend}
        />
      ) : (
        <p>No results found</p>
      )}
    </main>
  );
}

export default Page;
