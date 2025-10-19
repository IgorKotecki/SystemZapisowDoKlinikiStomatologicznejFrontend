import { Box, Typography, Button } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

export default function Pricing() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const colors = {
    color1: "#003141",
    color3: "#007987",
    color4: "#00b2b9",
    white: "#ffffff",
    gold: "#D4AF37",
  }

  const orthodonticsServices = [
    { name: "Konsultacja ortodontyczna", price: "300 zł" },
    { name: "Wyciski do modeli diagnostycznych", price: "200 zł" },
    { name: "Plan leczenia", price: "300 zł" },
    { name: "Aparat stały metalowy (1 łuk)", price: "3 000 zł" },
    { name: "Aparat stały bezmetalowy (1 łuk)", price: "3 600 zł" },
    { name: "Aparat stały porcelanowy (1 łuk)", price: "4 200 zł" },
    { name: "Aparat stały częściowy metalowy", price: "1 700 zł" },
    { name: "Aparat stały częściowy estetyczny", price: "2 000 zł" },
    { name: "Wizyta kontrolna aparat stały (1 łuk)", price: "280 zł" },
    { name: "Wizyta kontrolna aparat stały (2 łuki)", price: "340 zł" },
    { name: "Wizyta kontrolna aparat stały (bez wymiany łuku)", price: "220 zł" },
    { name: "Wizyta kontrolna aparat ruchomy", price: "180 zł" },
    { name: "Retainer stały", price: "600 zł" },
    { name: "Płytka retencyjna", price: "650 zł" },
    { name: "Hyrax", price: "1 600 zł" },
    { name: "Hybrid Hyrax", price: "2 500 zł" },
    { name: "Szyna Face/Margo", price: "1 200 zł" },
    { name: "Korekcja szyny", price: "300 zł" },
    { name: "Leczenie Invisalign", price: "20 000 zł" },
  ]

  const prostheticsServices = [
    { name: "Korona tymczasowa długotrwałowa CAD/CAM", price: "1 550 zł" },
    { name: "Korona ceramiczna", price: "od 2 500 zł" },
    { name: "Korona tymczasowa krótkotrwałowa", price: "300 zł" },
    { name: "Licówka ceramiczna", price: "4 000 zł" },
    { name: "Wkład koronowo-korzeniowy żary", price: "700 zł" },
    { name: "Wstup", price: "4 000 zł" },
    { name: "Proteza szkieletowa", price: "3 300 zł" },
    { name: "Most na włóknie szklanym (brak jednego zęba)", price: "1 200 zł" },
    { name: "Szyna twardą z prowadzeniem", price: "od 1 400 zł" },
    { name: "Deprogramator Kois", price: "600 zł" },
    { name: "Wizyta kontrolna", price: "200 zł" },
    { name: "Konsultacja", price: "300 zł" },
    { name: "Plan leczenia", price: "300 zł" },
  ]

  const endodonticsServices = [
    { name: "Pierwotne leczenie kanałowe sieczacza", price: "1 400 zł" },
    { name: "Pierwotne leczenie kanałowe kła", price: "1 500 zł" },
    { name: "Pierwotne leczenie kanałowe przedtrzonowca", price: "1 600 zł" },
    { name: "Pierwotne leczenie kanałowe trzonowca", price: "1 800 zł" },
    { name: "Powtórne leczenie kanałowe sieczacza", price: "1 600 zł" },
    { name: "Powtórne leczenie kanałowe kła", price: "1 700 zł" },
    { name: "Powtórne leczenie kanałowe przedtrzonowca", price: "1 800 zł" },
    { name: "Powtórne leczenie kanałowe trzonowca", price: "2 000 zł" },
  ]

  const ServiceSection = ({ title, services }: { title: string; services: Array<{ name: string; price: string }> }) => (
    <Box sx={{ mb: 8 }}>
      <Typography
        variant="h4"
        sx={{
          color: colors.white,
          textAlign: "center",
          mb: 4,
          fontWeight: "bold",
          letterSpacing: "0.1em",
        }}
      >
        {title}
      </Typography>
      <Box sx={{ maxWidth: "800px", mx: "auto" }}>
        {services.map((service, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 2,
              px: 3,
              borderBottom: index < services.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.05)",
              },
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: colors.white,
                flex: 1,
                fontSize: "1rem",
              }}
            >
              {service.name}
            </Typography>
            <Box
              sx={{
                flex: 1,
                height: "1px",
                background: `repeating-linear-gradient(to right, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 8px)`,
                mx: 2,
              }}
            />
            <Typography
              variant="body1"
              sx={{
                color: colors.white,
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              {service.price}
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
            "&:hover": {
              backgroundColor: "#B8941F",
            },
          }}
          onClick={() => navigate("/appointment")}
        >
          Umów wizytę
        </Button>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ width: "100vw", minHeight: "100vh" }}>
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          backgroundImage: 'url("/elegant-modern-dental-clinic-interior-with-dark-lu.jpg")',
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
              }}
            >
              cennik
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
              Nasze ceny są przejrzyste i konkurencyjne. Oferujemy najwyższą jakość usług stomatologicznych w
              przystępnych cenach. Wszystkie zabiegi wykonywane są przez doświadczonych specjalistów z wykorzystaniem
              nowoczesnego sprzętu.
            </Typography>
          </Box>

          <ServiceSection title="ORTODONCJA" services={orthodonticsServices} />
          <ServiceSection title="PROTETYKA" services={prostheticsServices} />
          <ServiceSection title="ENDODONCJA" services={endodonticsServices} />

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
                "&:hover": {
                  backgroundColor: "#B8941F",
                },
              }}
              onClick={() => navigate("/appointment")}
            >
              Umów konsultację
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
