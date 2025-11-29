import { Box, Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { colors } from "../utils/colors";
import type { Service } from "../Interfaces/Service";

export default function Pricing() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const lang = i18n.language || "pl";
        const res = await api.get(`api/Service/UserServices?lang=${lang}`);
        setServices(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language]);

  const grouped = services.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {} as Record<string, Service[]>);

  const ServiceSection = ({
    title,
    items,
  }: {
    title: string;
    items: Service[];
  }) => (
    <Box sx={{ mb: 8 }}>
      <Typography
        variant="h4"
        sx={{
          color: colors.white,
          textAlign: "center",
          mb: 4,
          fontWeight: "bold",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </Typography>

      <Box sx={{ maxWidth: "800px", mx: "auto" }}>
        {items.map((service, index) => (
          <Box
            key={service.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 2,
              px: 3,
              borderBottom:
                index < items.length - 1
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "none",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.05)" },
            }}
          >
            <Typography variant="body1" sx={{ color: colors.white, flex: 1 }}>
              {service.name}
            </Typography>

            <Box
              sx={{
                flex: 1,
                height: "1px",
                background:
                  "repeating-linear-gradient(to right, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 8px)",
                mx: 2,
              }}
            />

            <Typography
              variant="body1"
              sx={{ color: colors.white, fontWeight: "bold" }}
            >
              {service.lowPrice} zł
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: colors.gold,
            color: "#000",
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: 0,
            "&:hover": { backgroundColor: "#B8941F" },
          }}
          onClick={() => navigate("/appointment")}
        >
          {t("book") || "Umów wizytę"}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ width: "100vw", minHeight: "100vh" }}>
      <Box
        sx={{
          width: "100%",
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
            width: "100%",
            minHeight: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            py: 8,
            px: { xs: 2, md: 4 },
          }}
        >
          <Box sx={{ textAlign: "center", mb: 8, pt: 8 }}>
            <Typography
              variant="h2"
              sx={{
                color: colors.white,
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
                color: colors.white,
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

          {Object.keys(grouped).map((cat) => (
            <ServiceSection key={cat} title={cat} items={grouped[cat]} />
          ))}

          <Box sx={{ textAlign: "center", py: 8 }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: colors.gold,
                color: "#000",
                px: 6,
                py: 2,
                fontSize: "1.2rem",
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: 0,
                "&:hover": { backgroundColor: "#B8941F" },
              }}
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
