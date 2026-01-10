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
    <Box sx={{ width: "100%", minHeight: "100vh", backgroundColor: colors.white, overflowX: "hidden" }}>
      <Box
        sx={{
          width: "100%",
          height: { xs: "70vh", md: "85vh" },
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 49, 65, 0.75)",
            p: { xs: 3, md: 8 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center", 
            textAlign: "center", 
          }}
        >
          <Box sx={{ maxWidth: "800px" }}>
            <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2, color: colors.color5 }}>
              {t('servicesPage.title')}
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
              {t('servicesPage.subtitle')}
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: colors.color3,
                  "&:hover": { backgroundColor: colors.color4 },
                  textTransform: "none",
                  px: 4, py: 1.5, fontSize: "1.1rem", fontWeight: "bold"
                }}
                onClick={() => navigate("/appointment")}
              >
                {t('servicesPage.cta')}
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: colors.white,
                  color: colors.white,
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)", borderColor: colors.color5 },
                  textTransform: "none",
                  px: 4, py: 1.5, fontSize: "1.1rem"
                }}
                onClick={() => navigate("/prices")}
              >
                {t('servicesPage.prices')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ py: 12, px: { xs: 3, md: 10 }, backgroundColor: "#f0f7f9" }}>
        <Typography variant="h3" textAlign="center" sx={{ mb: 2, fontWeight: "bold", color: colors.color1 }}>
          {t("servicesPage.categories")}
        </Typography>
        <Box sx={{ width: "80px", height: "4px", backgroundColor: colors.color4, mx: "auto", mb: 8 }} />

        <Grid container spacing={4} justifyContent="center">
          {Object.entries(groupedServices).map(([categoryName, servicesList], index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }} sx={{ display: "flex" }}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "translateY(-5px)" }
                }}
              >
                <CardContent sx={{ p: 4, display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
                    {randomIcon[categoryName] ?? (
                      <HelpOutlineIcon sx={{ fontSize: 60, color: colors.color3 }} />
                    )}
                  </Box>

                  <Typography variant="h5" textAlign="center" sx={{ fontWeight: "bold", mb: 3, color: colors.color1 }}>
                    {categoryName}
                  </Typography>

                  <Box sx={{ flexGrow: 1, mb: 4 }}>
                    {servicesList.map((service) => (
                      <Box
                        key={service.id}
                        sx={{
                          mb: 2,
                          pb: 1,
                          borderBottom: `1px solid ${i18n.language === 'pl' ? '#eee' : '#eee'}`,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-end"
                        }}
                      >
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: colors.color1 }}>
                            {service.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatPrice(service.lowPrice, service.highPrice)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: "auto",
                      backgroundColor: colors.color3,
                      "&:hover": { backgroundColor: colors.color4 },
                      textTransform: "none",
                      borderRadius: 2,
                      fontWeight: "bold"
                    }}
                    onClick={() => navigate("/appointment")}
                  >
                    {t('servicesPage.appointment') || "Umów wizytę"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box
        sx={{
          py: 10,
          px: 4,
          backgroundColor: colors.color1,
          color: colors.white,
          textAlign: "center"
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
          {t("servicesPage.help")}
        </Typography>
        <Typography variant="h6" sx={{ mb: 6, opacity: 0.8, maxWidth: "600px", mx: "auto" }}>
          {t("servicesPage.contactUs")}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 3, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: colors.color5,
              color: colors.color1,
              "&:hover": { backgroundColor: colors.white },
              textTransform: "none",
              px: 5,
              fontWeight: "bold"
            }}
            onClick={() => navigate("/appointment")}
          >
            {t("servicesPage.appointment")}
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderColor: colors.color5,
              color: colors.color5,
              "&:hover": { borderColor: colors.white, color: colors.white },
              textTransform: "none",
              px: 5,
            }}
            onClick={() => navigate("/contacts")}
          >
            {t("servicesPage.contact")}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}