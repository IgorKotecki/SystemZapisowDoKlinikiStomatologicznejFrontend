import { Box, Typography, Button, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { colors } from "../utils/colors";
import type { Service } from "../Interfaces/Service";
import get from "../api/get";

export default function Pricing() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [groupedServices, setGroupedServices] = useState<Record<string, Service[]>>({});
  const [, setLoading] = useState(true);

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

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage:
            'url("/elegant-modern-dental-clinic-interior-with-dark-lu.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          position: "relative",
        }}
      >
        <Box
          sx={{
            minHeight: "100vh",
            backgroundColor: colors.white,
            py: 8,
            px: { xs: 2, md: 4 },
          }}
        >
          <Box sx={{ textAlign: "center", mb: 8, pt: 8 }}>
            <Typography
              variant="h2"
              sx={{
                color: colors.black,
                mb: 3,
                fontWeight: "300",
                letterSpacing: "0.2em",
                fontSize: { xs: "2.5rem", md: "4rem" },
                textTransform: "uppercase",
              }}
            >
              {t("prices.title") || "Cennik"}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: colors.black,
                opacity: 0.8,
                maxWidth: "600px",
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              {t("prices.subtitle") ||
                "Nasze ceny są przejrzyste i konkurencyjne. Oferujemy najwyższą jakość usług stomatologicznych w przystępnych cenach."}
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {Object.entries(groupedServices).map(([categoryName, servicesList], index) => (
              <Grid
                key={index}
                size={{ xs: 12, md: 12 }}
                component="div"
                sx={{ textAlign: "center" }}
              >
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 , color: colors.black}} >
                  {categoryName}
                </Typography>

                {servicesList.map((service) => (
                  <Box key={service.id} sx={{ mb: 1.5, textAlign: "center" }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 , color: colors.black}}>
                      {service.name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {formatPrice(service.lowPrice, service.highPrice)}
                    </Typography>
                  </Box>
                ))}
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: "center", py: 8 }}>
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: "auto", borderColor: colors.color1, color: colors.color1, "&:hover": { backgroundColor: colors.color2, color: colors.white, }, textTransform: "none", }}
              onClick={() => navigate("/appointment")}
            >
              {t("prices.cta") || "Umów konsultację"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
