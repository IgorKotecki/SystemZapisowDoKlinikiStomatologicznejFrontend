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
import { useParams } from "react-router-dom";
import i18n from "../../i18n";
import api from "../../api/axios";
import type { ToothData }  from "../../Interfaces/ToothData"
import { colors } from "../../utils/colors";

const DentalChartPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [teeth, setTeeth] = useState<ToothData[]>([]);
  const [loading, setLoading] = useState(true);
  //const [selectedTooth, setSelectedTooth] = useState<ToothData | null>(null);

  useEffect(() => {
    const fetchTeethData = async () => {
      try {
        const response = await api.post("/api/Tooth/ToothModel", {
          userId: 5,
          Language: i18n.language.toLowerCase()
        });
        console.log("Dane o zębach:", response.data);
        setTeeth(response.data.teeth);
      } catch (error) {
        console.error("Błąd pobierania danych o zębach:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeethData();
  }, [userId]);

  if (loading) {
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
        <CircularProgress sx={{ color: colors.color5 }} />
      </Box>
    );
  }

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
        <TeethModel teeth={teeth}/>
      </Box>
    </Box>
  );
};

export default DentalChartPage;
