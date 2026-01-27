import { Box, CircularProgress, Typography } from "@mui/material";
import UserNavigation from "./userComponents/userNavigation";
import { colors } from "../utils/colors";

export default function LoadingScreen() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.color1,
        color: colors.white,
      }}
    >
      <UserNavigation />
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <CircularProgress size={60} sx={{ color: colors.color5, mb: 3 }} />
      </Box>
    </Box>
  );
}
