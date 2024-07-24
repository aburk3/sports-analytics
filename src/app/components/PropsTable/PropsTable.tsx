// components/PropsTable.tsx
import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import { Alternate, Prop } from "./types";

interface PropsTableProps {
  filteredProps: Prop[];
  alternates: Alternate[];
  isManuallySuspended: (playerId: number, statTypeId: number) => boolean;
  onManualSuspend: (playerId: number, statTypeId: number) => void;
}

export const PropsTable: React.FC<PropsTableProps> = ({
  filteredProps,
  alternates,
  isManuallySuspended,
  onManualSuspend,
}) => (
  <TableContainer component={Paper}>
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell align="left">Player</TableCell>
          <TableCell align="left">Team</TableCell>
          <TableCell align="left">Position</TableCell>
          <TableCell align="left">Stat Type</TableCell>
          <TableCell align="left">Optimal Line</TableCell>
          <TableCell align="left">Low Line</TableCell>
          <TableCell align="left">High Line</TableCell>
          <TableCell align="left">Suspended</TableCell>
          <TableCell align="left">Manual Suspend</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredProps.map((prop) => {
          const alternateLines = alternates.filter(
            (alternate) =>
              alternate.playerId === prop.playerId &&
              alternate.statTypeId === prop.statTypeId
          );
          const lowLine =
            alternateLines.length > 0
              ? Math.min(...alternateLines.map((alternate) => alternate.line))
              : null;
          const highLine =
            alternateLines.length > 0
              ? Math.max(...alternateLines.map((alternate) => alternate.line))
              : null;
          const optimalLineExists = alternateLines.some(
            (alternate) => alternate.line === prop.line
          );
          const optimalLineProb = alternateLines.find(
            (alternate) => alternate.line === prop.line
          );
          const suspended =
            prop.marketSuspended === 1 ||
            !optimalLineExists ||
            (optimalLineProb &&
              optimalLineProb.underOdds < 0.4 &&
              optimalLineProb.overOdds < 0.4 &&
              optimalLineProb.pushOdds < 0.4);

          const manuallySuspended = isManuallySuspended(
            prop.playerId,
            prop.statTypeId
          );
          const finalSuspended = manuallySuspended || suspended;

          return (
            <TableRow key={`${prop.playerId}-${prop.statTypeId}`}>
              <TableCell align="left" component="th" scope="row">
                {prop.playerName}
              </TableCell>
              <TableCell align="left">{prop.teamAbbr}</TableCell>
              <TableCell align="left">{prop.position}</TableCell>
              <TableCell align="left">{prop.statType}</TableCell>
              <TableCell align="left">{prop.line}</TableCell>
              <TableCell align="left">
                {lowLine !== null ? lowLine : "N/A"}
              </TableCell>
              <TableCell align="left">
                {highLine !== null ? highLine : "N/A"}
              </TableCell>
              <TableCell align="left">
                {finalSuspended ? "Yes" : "No"}
              </TableCell>
              <TableCell align="left">
                <Switch
                  checked={manuallySuspended}
                  onChange={() =>
                    onManualSuspend(prop.playerId, prop.statTypeId)
                  }
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
);
