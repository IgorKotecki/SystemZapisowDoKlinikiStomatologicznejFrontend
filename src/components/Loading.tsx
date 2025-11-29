import { Box, CircularProgress, Typography } from "@mui/material";
import UserNavigation from "./userComponents/userNavigation";
import { colors } from "../utils/colors";

export default function LoadingScreen() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.color1,
        color: colors.white,
      }}
    >
      <UserNavigation />
      <CircularProgress size={60} sx={{ color: colors.color5, mb: 3 }} />
      <Typography variant="h6">Ładowanie...</Typography>
    </Box>
  );
}
