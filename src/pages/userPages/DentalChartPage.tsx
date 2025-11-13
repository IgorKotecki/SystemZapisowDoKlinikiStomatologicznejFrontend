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
import { useParams, useNavigate } from "react-router-dom";
import UserNavigation from "../../components/userComponents/userNavigation";
import { useTranslation } from "react-i18next";
// import api from "../../api/axios";

const colors = {
  color1: "#003141",
  color2: "#004f5f",
  color3: "#007987",
  color4: "#00b2b9",
  color5: "#00faf1",
  white: "#ffffff",
};

interface ToothData {
  number: number;
  state: "healthy" | "cavity" | "missing" | "crown" | "root-canal";
  notes?: string;
}

const DentalChartPage: React.FC = () => {
  const { t } = useTranslation();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [teeth, setTeeth] = useState<ToothData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTooth, setSelectedTooth] = useState<ToothData | null>(null);

  useEffect(() => {
    const fetchTeethData = async () => {
      try {
        // const response = await api.get();
        // setTeeth(response.data);

        const mockTeeth = Array.from({ length: 32 }, (_, i) => ({
          number: i < 16 ? 18 - i : 49 - (i - 16),
          state: ["1", "2", "3", "4", "5", "6"][
            Math.floor(Math.random() * 6)
          ] as ToothData["state"],
          notes: "Brak dodatkowych uwag.",
        }));
        setTeeth(mockTeeth);
      } catch (error) {
        console.error("Błąd pobierania danych o zębach:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeethData();
  }, [userId]);

  const getToothColor = (state: ToothData["state"]) => {
    switch (state) {
      case "1":
        return "#4CAF50";
      case "2":
        return "#FFC107";
      case "3":
        return "#F44336";
      case "4":
        return "#953bdfff";
      case "5":
        return "#3e3e3fff";
      case "6":
        return "#dbdbdfff";
      default:
        return colors.white;
    }
  };

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

        <Paper
          elevation={5}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: colors.color2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 3, color: colors.color5 }}>
            {t("dentalChart.toothDiagram")}
          </Typography>

          <Grid container justifyContent="center" spacing={1} sx={{ mb: 5 }}>
            {teeth.slice(0, 16).map((tooth) => (
              <Grid item key={tooth.number}>
                <Tooltip title={`Tooth ${tooth.number}`} arrow>
                  <Box
                    onClick={() => setSelectedTooth(tooth)}
                    sx={{
                      width: 32,
                      height: 48,
                      backgroundColor: getToothColor(tooth.state),
                      borderRadius: 5,
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "scale(1.2)",
                        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                      },
                    }}
                  />
                </Tooltip>
              </Grid>
            ))}
          </Grid>

          <Grid container justifyContent="center" spacing={1}>
            {teeth.slice(16, 32).map((tooth) => (
              <Grid item key={tooth.number}>
                <Tooltip title={`Tooth ${tooth.number}`} arrow>
                  <Box
                    onClick={() => setSelectedTooth(tooth)}
                    sx={{
                      width: 32,
                      height: 48,
                      backgroundColor: getToothColor(tooth.state),
                      borderRadius: 5,
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "scale(1.2)",
                        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                      },
                    }}
                  />
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>

      <Dialog
        open={!!selectedTooth}
        onClose={() => setSelectedTooth(null)}
        PaperProps={{
          sx: { backgroundColor: colors.color2, color: colors.white },
        }}
      >
        <DialogTitle sx={{ color: colors.color5 }}>
          {t("dentalChart.tooth")} #{selectedTooth?.number}
        </DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ mb: 1 }}>
            {t("dentalChart.state")}:{" "}
            <strong style={{ color: getToothColor(selectedTooth?.state || "healthy") }}>
              {selectedTooth?.state}
            </strong>
          </Typography>
          <Typography>{t("dentalChart.notes")}: {selectedTooth?.notes}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setSelectedTooth(null)}
            sx={{
              color: colors.white,
              backgroundColor: colors.color3,
              "&:hover": { backgroundColor: colors.color4 },
            }}
          >
            {t("dentalChart.close")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DentalChartPage;
