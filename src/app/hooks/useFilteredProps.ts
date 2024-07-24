import { useMemo } from "react";
import { Alternate, Prop } from "../components/PropsTable/types";

const useFilteredProps = (
  props: Prop[],
  alternates: Alternate[],
  positionFilter: string,
  statTypeFilter: string,
  marketStatusFilter: string,
  searchTerm: string,
  manualSuspendedMarkets: Set<string>
) => {
  return useMemo(() => {
    let tempProps = [...props];

    if (positionFilter) {
      tempProps = tempProps.filter(
        ({ position }) => position === positionFilter
      );
    }

    if (statTypeFilter) {
      tempProps = tempProps.filter(
        ({ statType }) => statType === statTypeFilter
      );
    }

    if (marketStatusFilter) {
      tempProps = tempProps.filter(
        ({ playerId, statTypeId, line, marketSuspended }) => {
          const alternateLines = alternates.filter(
            (alternate) =>
              alternate.playerId === playerId &&
              alternate.statTypeId === statTypeId
          );
          const optimalLineExists = alternateLines.some(
            (alternate) => alternate.line === line
          );
          const optimalLineProb = alternateLines.find(
            (alternate) => alternate.line === line
          );
          const suspended =
            marketSuspended === 1 ||
            !optimalLineExists ||
            (optimalLineProb &&
              optimalLineProb.underOdds < 0.4 &&
              optimalLineProb.overOdds < 0.4 &&
              optimalLineProb.pushOdds < 0.4);

          const manuallySuspended = manualSuspendedMarkets.has(
            `${playerId}-${statTypeId}`
          );
          const finalSuspended = manuallySuspended || suspended;

          return marketStatusFilter === "suspended"
            ? finalSuspended
            : !finalSuspended;
        }
      );
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      tempProps = tempProps.filter(
        ({ playerName, teamNickname, teamAbbr }) =>
          playerName.toLowerCase().includes(lowerSearchTerm) ||
          teamNickname.toLowerCase().includes(lowerSearchTerm) ||
          teamAbbr.toLowerCase().includes(lowerSearchTerm)
      );
    }

    return tempProps;
  }, [
    props,
    alternates,
    positionFilter,
    statTypeFilter,
    marketStatusFilter,
    searchTerm,
    manualSuspendedMarkets,
  ]);
};

export default useFilteredProps;
