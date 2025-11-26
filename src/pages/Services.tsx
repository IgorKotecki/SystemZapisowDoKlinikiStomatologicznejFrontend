import { Box, Typography, Button, Grid, Card, CardContent, CardMedia, Chip, Paper } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import BuildIcon from "@mui/icons-material/Build";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PsychologyIcon from "@mui/icons-material/Psychology";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import React, { useEffect, useState } from "react"
import type { JSX } from "react";
import api from '../api/axios';

interface ServiceDTO {
  id: number;
  name: string;
  description: string;
  lowPrice: number;
  highPrice: number;
  minTime: number;
  languageCode: string;
  category: string;
}

export default function Services() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const colors = {
    color1: "#003141",
    color3: "#007987",
    color4: "#00b2b9",
    white: "#ffffff",
  }

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const lang = i18n.language || 'pl';
        const response = await api.get(`api/Service/UserServices?lang=${lang}`)
        const data: ServiceDTO[] = response.data;

        const randomized = data.length > 3 ? [...data].sort(() => Math.random() - 0.5).slice(0, 3) : data;
        setServices(randomized)
        console.log(randomized)
      } catch (error) {
        console.error('Error featchins services ', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [i18n.language]);

  const grouped = services.reduce((acc, service) => {
    if (!acc[service.category]) acc[service.category] = [];
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, ServiceDTO[]>);

  const categoryIcons: Record<string, JSX.Element> = {
    "Higiena": <MedicalServicesIcon sx={{ fontSize: 50, color: "#007987" }} />,
    "Estetyka": <AutoFixHighIcon sx={{ fontSize: 50, color: "#007987" }} />,
    "Chirurgia": <BuildIcon sx={{ fontSize: 50, color: "#007987" }} />,
    "Dziecięca": <ChildCareIcon sx={{ fontSize: 50, color: "#007987" }} />,
    "Diagnostyka": <LocalHospitalIcon sx={{ fontSize: 50, color: "#007987" }} />,
    "Psychologia": <PsychologyIcon sx={{ fontSize: 50, color: "#007987" }} />,
  };


  return (
    <Box sx={{ width: "100vw", minHeight: "100vh", backgroundColor: colors.white }}>
      <Box
        sx={{
          width: "100%",
          height: { xs: "70vh", md: "90vh" },
          backgroundImage: 'url("/images/dental-services.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          color: colors.white,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: { xs: "70vh", md: "85vh" },
            backgroundColor: "rgba(0, 49, 65, 0.8)",
            p: 2.5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <Typography variant="h3" gutterBottom>
              Nasze usługi
            </Typography>
            <Typography variant="h6" gutterBottom>
              Kompleksowa opieka stomatologiczna na najwyższym poziomie. Odkryj pełen zakres naszych specjalistycznych
              usług.
            </Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                mt: 3,
                backgroundColor: colors.color3,
                "&:hover": { backgroundColor: colors.color4 },
                textTransform: "none",
                px: 2,
              }}
              onClick={() => navigate("/appointment")}
            >
              Umów wizytę
            </Button>
            <Button
              variant="contained"
              size="large"
              sx={{
                mt: 3,
                backgroundColor: colors.color3,
                "&:hover": { backgroundColor: colors.color4 },
                textTransform: "none",
                px: 2,
              }}
              onClick={() => navigate("/prices")}
            >
              Zobacz cennik
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ py: 8, px: { xs: 2, md: 4 }, backgroundColor: "#f5f5f5" }}>
        <Typography variant="h4" textAlign="center" sx={{ mb: 6 }}>
          {t("services.categories")}
        </Typography>

        <Grid container spacing={4}>
          {Object.keys(grouped).map((categoryName, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card sx={{ borderRadius: 3, boxShadow: 2, height: "100%" }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 2, fontSize: 40, color: colors.color3 }}>
                    {categoryIcons[categoryName] ?? <HelpOutlineIcon sx={{ fontSize: 50, color: "#007987" }} />}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                    {categoryName}
                  </Typography>
                  {grouped[categoryName].map((service) => (
                    <Box key={service.id} sx={{ mb: 1.5 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {service.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {service.lowPrice} - {service.highPrice} zł
                      </Typography>
                    </Box>
                  ))}

                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      mt: 3,
                      borderColor: colors.color3,
                      color: colors.color3,
                      "&:hover": {
                        backgroundColor: colors.color3,
                        color: colors.white,
                      },
                      textTransform: "none",
                    }}
                    onClick={() => navigate("/appointment")}
                  >
                    {t("book")}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* <Box sx={{ py: 8, px: { xs: 2, md: 4 }, backgroundColor: colors.color1, color: colors.white }}>
        <Typography variant="h4" textAlign="center" gutterBottom sx={{ mb: 6 }}>
          Jak przebiega leczenie?
        </Typography>
        <Grid container spacing={4}>
          {processSteps.map((step, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h2" sx={{ fontWeight: "bold", color: colors.color4, mb: 2 }}>
                  {step.step}
                </Typography>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                  {step.title}
                </Typography>
                <Typography variant="body1">{step.description}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box> */}

      <Box
        sx={{ py: 8, px: { xs: 2, md: 4 }, backgroundColor: colors.color3, color: colors.white, textAlign: "center" }}
      >
        <Typography variant="h4" gutterBottom>
          Potrzebujesz porady?
        </Typography>
        <Typography variant="h6" paragraph sx={{ mb: 4 }}>
          Skontaktuj się z nami, aby dowiedzieć się więcej o naszych usługach i umówić wizytę.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: colors.white,
              color: colors.color3,
              "&:hover": { backgroundColor: "#f0f0f0" },
              textTransform: "none",
              px: 4,
            }}
            onClick={() => navigate("/appointment")}
          >
            Umów wizytę
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderColor: colors.white,
              color: colors.white,
              "&:hover": {
                backgroundColor: colors.white,
                color: colors.color3,
              },
              textTransform: "none",
              px: 4,
            }}
            onClick={() => navigate("/contact")}
          >
            Skontaktuj się
          </Button>
        </Box>
      </Box>
    </Box>
  )
}