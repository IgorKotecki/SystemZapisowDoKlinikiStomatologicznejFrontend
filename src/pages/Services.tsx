import { Box, Typography, Button, Grid, Card, CardContent, CardMedia, Chip, Paper } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import MedicalServicesIcon from "@mui/icons-material/MedicalServices"
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh"
import BuildIcon from "@mui/icons-material/Build"
import ChildCareIcon from "@mui/icons-material/ChildCare"
import LocalHospitalIcon from "@mui/icons-material/LocalHospital"
import PsychologyIcon from "@mui/icons-material/Psychology"
import { useEffect, useState } from "react"
import api from '../api/axios';

export default function Services() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const [servicesData, setServicesData] = useState<{
    Id: string, lowPrice: string, highPrice: string, minTime: string, langCode: string, name: string, description: string
  }[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [services, setServices] = useState<{ id: string, name: string }[]>([]);

  const colors = {
    color1: "#003141",
    color3: "#007987",
    color4: "#00b2b9",
    white: "#ffffff",
  }

  const decodeJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      console.error('Błąd przy dekodowaniu tokena:', err);
      return null;
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true);
      try {
        const token = localStorage.getItem('token');
        let role = 'Unregistered_user'; // domyślnie dla niezalogowanych
        if (token) {
          const claims = decodeJwt(token);
          if (claims) {
            const userRole =
              claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            if (userRole) {
              role = userRole;
            }
          }
        }
        const response = await api.get('/api/service/UserServices', {
          params: {
            lang: i18n.language,
            role: role,
          },
        });
        console.log(response.data);
        //setServices(response.data);
      } catch (error) {
        console.error('Error while geting the services:', error);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, [i18n.language]);

  const serviceCategories = [
    {
      icon: <MedicalServicesIcon sx={{ fontSize: "3rem", color: colors.color3 }} />,
      title: "Stomatologia ogólna",
      description: "Kompleksowa opieka stomatologiczna dla całej rodziny",
      services: [
        "Przeglądy stomatologiczne",
        "Leczenie próchnicy",
        "Plomby kompozytowe",
        "Czyszczenie kamienia",
        "Fluoryzacja",
      ],
    },
    {
      icon: <AutoFixHighIcon sx={{ fontSize: "3rem", color: colors.color3 }} />,
      title: "Stomatologia estetyczna",
      description: "Piękny uśmiech to nasza specjalność",
      services: [
        "Wybielanie zębów",
        "Licówki porcelanowe",
        "Korony estetyczne",
        "Bonding kompozytowy",
        "Makeover uśmiechu",
      ],
    },
    {
      icon: <BuildIcon sx={{ fontSize: "3rem", color: colors.color3 }} />,
      title: "Protetyka",
      description: "Odbudowa i zastąpienie utraconych zębów",
      services: ["Korony i mosty", "Protezy częściowe", "Protezy całkowite", "Protezy na implantach", "Naprawy protez"],
    },
    {
      icon: <LocalHospitalIcon sx={{ fontSize: "3rem", color: colors.color3 }} />,
      title: "Implantologia",
      description: "Nowoczesne rozwiązania dla brakujących zębów",
      services: ["Implanty pojedyncze", "Mosty na implantach", "All-on-4", "Augmentacja kości", "Sinus lift"],
    },
    {
      icon: <PsychologyIcon sx={{ fontSize: "3rem", color: colors.color3 }} />,
      title: "Ortodoncja",
      description: "Prostowanie zębów dla dzieci i dorosłych",
      services: [
        "Aparaty stałe",
        "Aparaty ruchome",
        "Aparaty niewidoczne",
        "Retencja ortodontyczna",
        "Diagnostyka ortodontyczna",
      ],
    },
    {
      icon: <ChildCareIcon sx={{ fontSize: "3rem", color: colors.color3 }} />,
      title: "Stomatologia dziecięca",
      description: "Specjalistyczna opieka nad najmłodszymi",
      services: ["Przeglądy dzieci", "Lakowanie bruzd", "Leczenie mleczaków", "Profilaktyka", "Edukacja higieniczna"],
    },
  ]

  const featuredServices = [
    {
      title: "Wybielanie zębów",
      description: "Profesjonalne wybielanie zębów w gabinecie lub w domu",
      image: "/images/services/whitening.jpg",
      price: "od 800 zł",
      duration: "60 min",
      popular: true,
    },
    {
      title: "Implanty zębowe",
      description: "Trwałe rozwiązanie dla brakujących zębów",
      image: "/images/services/implants.jpg",
      price: "od 2500 zł",
      duration: "90 min",
      popular: false,
    },
    {
      title: "Licówki porcelanowe",
      description: "Idealne rozwiązanie dla pięknego uśmiechu",
      image: "/images/services/veneers.jpg",
      price: "od 1200 zł",
      duration: "120 min",
      popular: true,
    },
    {
      title: "Aparaty ortodontyczne",
      description: "Nowoczesne rozwiązania ortodontyczne",
      image: "/images/services/braces.jpg",
      price: "od 3500 zł",
      duration: "45 min",
      popular: false,
    },
  ]

  const processSteps = [
    {
      step: "01",
      title: "Konsultacja",
      description: "Szczegółowy przegląd i plan leczenia",
    },
    {
      step: "02",
      title: "Diagnostyka",
      description: "Nowoczesne badania i zdjęcia RTG",
    },
    {
      step: "03",
      title: "Leczenie",
      description: "Profesjonalne wykonanie zabiegu",
    },
    {
      step: "04",
      title: "Kontrola",
      description: "Regularne wizyty kontrolne",
    },
  ]

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

      {/* Service Categories */}
      <Box sx={{ py: 8, px: { xs: 2, md: 4 }, backgroundColor: "#f5f5f5" }}>
        <Typography variant="h4" textAlign="center" gutterBottom sx={{ mb: 6 }}>
          Kategorie usług
        </Typography>
        <Grid container spacing={4}>
          {serviceCategories.map((category, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card sx={{ borderRadius: 3, boxShadow: 2, height: "100%" }}>
                <CardContent sx={{ p: 4, textAlign: "center" }}>
                  <Box sx={{ mb: 3 }}>{category.icon}</Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                    {category.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {category.description}
                  </Typography>
                  <Box sx={{ textAlign: "left" }}>
                    {category.services.map((service, serviceIndex) => (
                      <Typography key={serviceIndex} variant="body2" sx={{ mb: 0.5 }}>
                        • {service}
                      </Typography>
                    ))}
                  </Box>
                  <Button
                    variant="outlined"
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
                    Umów wizytę
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Featured Services */}
      <Box sx={{ py: 8, px: { xs: 2, md: 4 }, backgroundColor: colors.white }}>
        <Typography variant="h4" textAlign="center" gutterBottom sx={{ mb: 6 }}>
          Popularne zabiegi
        </Typography>
        <Grid container spacing={4}>
          {featuredServices.map((service, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, height: "100%", position: "relative" }}>
                {service.popular && (
                  <Chip
                    label="Popularne"
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      backgroundColor: colors.color3,
                      color: colors.white,
                      zIndex: 1,
                    }}
                  />
                )}
                <CardMedia
                  component="img"
                  height="200"
                  image={service.image}
                  alt={service.title}
                  sx={{
                    objectFit: "cover",
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {service.description}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" sx={{ color: colors.color3, fontWeight: "bold" }}>
                      {service.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {service.duration}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: colors.color3,
                      "&:hover": { backgroundColor: colors.color4 },
                      textTransform: "none",
                    }}
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

      {/* Process Steps */}
      <Box sx={{ py: 8, px: { xs: 2, md: 4 }, backgroundColor: colors.color1, color: colors.white }}>
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
      </Box>

      {/* CTA Section */}
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