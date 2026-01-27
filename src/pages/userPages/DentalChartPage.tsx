import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import { ArrowLeft } from "lucide-react";
import UserNavigation from "../../components/userComponents/userNavigation";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import TeethModel from "../../components/TeethModel";
import i18n from "../../i18n";
import type { ToothData } from "../../Interfaces/ToothData"
import { colors } from "../../utils/colors";
import { useAuth } from "../../context/AuthContext";
import get from "../../api/get";

const DentalChartPage: React.FC = () => {
  const { userId } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [teeth, setTeeth] = useState<ToothData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeethData = async () => {
      try {
        const lang = i18n.language;
        if (!userId)
          return;
        const response = await get.getTeethModel(userId, lang);
        console.log("Dane o zębach:", response);
        setTeeth(response);
      } catch (error) {
        console.error("Błąd pobierania danych o zębach:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeethData();
  }, [t]);

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
        {loading ? <CircularProgress size={60} sx={{ color: colors.color5, mb: 3 }} /> : <TeethModel teeth={teeth} />}
      </Box>
    </Box>
  );
};

export default DentalChartPage;
