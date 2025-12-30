import { Box, Typography, Button, Grid, Card, CardContent, CardMedia, Chip, Paper } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import BiotechIcon from "@mui/icons-material/Biotech";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import EmojiNatureIcon from "@mui/icons-material/EmojiNature";
import PsychologyIcon from "@mui/icons-material/Psychology";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useEffect, useState, useMemo } from "react"
import type { JSX } from "react";
import { colors } from "../utils/colors";
import type { Service } from "../Interfaces/Service";
import get from "../api/get";

export default function Services() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [groupedServices, setGroupedServices] = useState<Record<string, Service[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const lang = i18n.language || 'pl';
        const data = await get.getAllServices(lang);
        setGroupedServices(data.servicesByCategory);
      } catch (error) {
        console.error('Error featchins services ', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [i18n.language]);

  const formatPrice = (low: number | null, high: number | null) => {
    if (low === null && high !== null) {
      return `${high} zł`;
    }
    if (low !== null && high === null) {
      return `od ${low} zł`;
    }
    if (low !== null && high !== null) {
      return `${low} - ${high} zł`;
    }
    return "—";
  };

  const dentalIcons = [
    <MedicalServicesIcon sx={{ fontSize: 50, color: colors.color3 }} />,
    <HealthAndSafetyIcon sx={{ fontSize: 50, color: colors.color3 }} />,
    <VaccinesIcon sx={{ fontSize: 50, color: colors.color3 }} />,
    <BiotechIcon sx={{ fontSize: 50, color: colors.color3 }} />,
    <CleaningServicesIcon sx={{ fontSize: 50, color: colors.color3 }} />,
    <MonitorHeartIcon sx={{ fontSize: 50, color: colors.color3 }} />,
    <EmojiNatureIcon sx={{ fontSize: 50, color: colors.color3 }} />,
    <PsychologyIcon sx={{ fontSize: 50, color: colors.color3 }} />,
  ];

  const getRandomIcon = () => dentalIcons[Math.floor(Math.random() * dentalIcons.length)];

  const randomIcon = useMemo(() => {
    const icons: Record<string, JSX.Element> = {};
    Object.keys(groupedServices).forEach(category => {
      icons[category] = getRandomIcon();
    })
    return icons;
  }, [Object.keys(groupedServices).length])

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
              {t('servicesPage.title')}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {t('servicesPage.subtitle')}
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
              {t('servicesPage.cta')}
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
              {t('servicesPage.prices')}
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ py: 8, px: { xs: 2, md: 4 }, backgroundColor: "#f5f5f5" }}>
        <Typography variant="h4" textAlign="center" sx={{ mb: 6 }}>
          {t("servicesPage.categories")}
        </Typography>

        <Grid container spacing={4} justifyContent={"center"}>
          {Object.entries(groupedServices).map(([categoryName, servicesList], index) => (
            <Grid key={index} size={{ xs: 12, md: 5 }} component="div">
              <Card sx={{ borderRadius: 10, boxShadow: 2, height: "100%" }}>
                <CardContent sx={{ p: 4, display: "flex", flexDirection: "column", flexGrow: 1 }}>

                  <Box sx={{ mb: 2, fontSize: 40, color: colors.color3 }}>
                    {randomIcon[categoryName] ?? (
                      <HelpOutlineIcon sx={{ fontSize: 50, color: colors.color3 }} />
                    )}
                  </Box>

                  <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                    {categoryName}
                  </Typography>

                  {servicesList.map((service) => (
                    <Box key={service.id} sx={{ mb: 1.5 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {service.name}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {formatPrice(service.lowPrice, service.highPrice)}
                      </Typography>
                    </Box>
                  ))}

                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ mt: "auto", borderColor: colors.color3, color: colors.color3, "&:hover": { backgroundColor: colors.color3, color: colors.white, }, textTransform: "none", }}
                    onClick={() => navigate("/appointment")}
                  >
                    Umów wizytę
                  </Button>

                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
        sx={{ py: 8, px: { xs: 2, md: 4 }, backgroundColor: colors.color3, color: colors.white, textAlign: "center" }}
      >
        <Typography variant="h4" gutterBottom>
          {t("servicesPage.help")}
        </Typography>
        <Typography variant="h6" paragraph sx={{ mb: 4 }}>
          {t("servicesPage.contactUs")}
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
            {t("servicesPage.appointment")}
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
            {t("servicesPage.contact")}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}