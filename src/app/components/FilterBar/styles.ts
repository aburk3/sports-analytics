import styled from "styled-components";
import TextField from "@mui/material/TextField";

const CustomTextField = styled(TextField)`
  width: 300px;
  min-width: 150px;
  padding-right: 0px;

  flex: 1;
  min-width: 200px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;

  margin-bottom: 16px;
  /* marginBottom: "16px", display: "flex", gap: "16px"; */

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

export { FilterContainer, CustomTextField };
