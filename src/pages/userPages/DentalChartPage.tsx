import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
} from "@mui/material";
import { ArrowLeft } from "lucide-react";
import UserNavigation from "../../components/userComponents/userNavigation";
import { useTranslation } from "react-i18next";
import {useNavigate } from "react-router-dom";
import TeethModel from "../../components/TeethModel";
// import api from "../../api/axios";

const colors = {
    color1: "#003141",
    color2: "#004f5f",
    color3: "#007987",
    color4: "#00b2b9",
    color5: "#00faf1",
    white: "#ffffff",
};

const DentalChartPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100vh",
        width: "100%",
        backgroundColor: colors.color1,
      }}
    >
      <UserNavigation />

      <Box
        sx={{
          flex: 1,
          px: { xs: 2, md: 8 },
          py: 6,
          color: colors.white,
        }}
      >
        <Button
          startIcon={<ArrowLeft />}
          onClick={() => navigate(-1)}
          sx={{
            mb: 3,
            color: colors.color5,
            "&:hover": { backgroundColor: colors.color3 },
          }}
        >
          {t("dentalChart.back")}
        </Button>

        <Typography variant="h4" sx={{ color: colors.color5 }} gutterBottom>
          {t("dentalChart.title")}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4 }}>
          {t("dentalChart.subtitle")}
        </Typography>
        <TeethModel />

      </Box>
    </Box>
  );
};

export default DentalChartPage;
