import { Box, Typography, Button, Grid, Card, CardContent, Avatar } from "@mui/material";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import VerifiedIcon from "@mui/icons-material/Verified";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SecurityIcon from "@mui/icons-material/Security";
import { colors } from "../utils/colors";

export default function About() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const values = [
    {
      icon: <FavoriteIcon sx={{ fontSize: "3rem", color: colors.color3 }} />,
      title: t("about.values.patientCare.title"),
      description: t("about.values.patientCare.desc"),
    },
    {
      icon: <VerifiedIcon sx={{ fontSize: "3rem", color: colors.color3 }} />,
      title: t("about.values.professionalism.title"),
      description: t("about.values.professionalism.desc"),
    },
    {
      icon: <SecurityIcon sx={{ fontSize: "3rem", color: colors.color3 }} />,
      title: t("about.values.security.title"),
      description: t("about.values.security.desc"),
    },
    {
      icon: <StarIcon sx={{ fontSize: "3rem", color: colors.color3 }} />,
      title: t("about.values.excellence.title"),
      description: t("about.values.excellence.desc"),
    },
  ];

  const achievements = [
    { number: "15+", label: t("about.experience") },
    { number: "5000+", label: t("about.patients") },
    { number: "10+", label: t("about.specialists") },
    { number: "98%", label: t("about.opinions") },
  ];

  const testimonials = [
    {
      name: "Anna Kowalska",
      text: t("about.feedback1"),
      rating: 5,
    },
    {
      name: "Piotr Nowak",
      text: t("about.feedback2"),
      rating: 5,
    },
    {
      name: "Maria Wiśniewska",
      text: t("about.feedback3"),
      rating: 5,
    },
  ];
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
          <Box sx={{ maxWidth: "900px" }}>
            <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2, color: colors.color5 }}>
              {t('about.aboutOutClinic')}
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
              {t('about.aboutOutClinicText')}
            </Typography>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
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
                {t('appointment.title')}
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
                onClick={() => navigate("/team")}
              >
                {t('team')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ py: 12, px: { xs: 3, md: 15 }, backgroundColor: "#f8f9fa" }}>
        <Grid container spacing={8} alignItems="center" justifyContent="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h3" gutterBottom sx={{ color: colors.color1, fontWeight: "bold" }}>
              {t('about.ourStroy')}
            </Typography>
            <Box sx={{ width: "60px", height: "4px", backgroundColor: colors.color4, mb: 4 }} />
            <Typography variant="body1" sx={{ fontSize: "1.1rem", color: colors.color1, opacity: 0.9 }}>
              {t('about.storyPart1')}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1.1rem", color: colors.color1, opacity: 0.9 }}>
              {t('about.storyPart2')}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                width: "100%",
                height: "450px",
                backgroundImage: 'url("/images/gabinet.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: 4,
                boxShadow: "0px 20px 40px rgba(0,0,0,0.1)",
              }}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ py: 12, px: { xs: 3, md: 10 }, backgroundColor: colors.white }}>
        <Typography variant="h3" textAlign="center" gutterBottom sx={{ mb: 8, color: colors.color1, fontWeight: "bold" }}>
          {t('about.ourValues')}
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {values.map((value, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{
                borderRadius: 4,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                height: "100%",
                textAlign: "center",
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-10px)" }
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 3, color: colors.color3, fontSize: "2.5rem" }}>{value.icon}</Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: colors.color1 }}>
                    {value.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {value.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ py: 10, px: { xs: 3, md: 10 }, backgroundColor: colors.color1, color: colors.white }}>
        <Grid container spacing={4} justifyContent="center">
          {achievements.map((achievement, index) => (
            <Grid key={index} size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h2" sx={{ fontWeight: "bold", color: colors.color5, mb: 1 }}>
                  {achievement.number}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.8 }}>{achievement.label}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ py: 12, px: { xs: 3, md: 10 }, backgroundColor: "#e0f7f8" }}>
        <Typography variant="h3" textAlign="center" gutterBottom sx={{ mb: 8, color: colors.color1, fontWeight: "bold" }}>
          {t('about.whatPSay')}
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {testimonials.map((testimonial, index) => (
            <Grid key={index} size={{ xs: 12, md: 4 }}>
              <Card sx={{ borderRadius: 4, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", height: "100%" }}>
                <CardContent sx={{ p: 5 }}>
                  <Box sx={{ display: "flex", mb: 3 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} sx={{ color: colors.yellowTooth, fontSize: "1.5rem" }} />
                    ))}
                  </Box>
                  <Typography variant="body1" paragraph sx={{ fontStyle: "italic", fontSize: "1.1rem", mb: 4, minHeight: "80px" }}>
                    "{testimonial.text}"
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ bgcolor: colors.color3, width: 50, height: 50, mr: 2 }}>{testimonial.name.charAt(0)}</Avatar>
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: colors.color1 }}>
                      {testimonial.name}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
        sx={{
          py: 12,
          px: 4,
          backgroundColor: colors.color3,
          color: colors.white,
          textAlign: "center"
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: "bold", mb: 3 }}>
          {t('about.readyForVisit')}
        </Typography>
        <Typography variant="h6" sx={{ mb: 5, opacity: 0.9, maxWidth: "700px", mx: "auto" }}>
          {t('about.joinThousands')}
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: colors.white,
            color: colors.color3,
            "&:hover": { backgroundColor: colors.color5, color: colors.color1 },
            textTransform: "none",
            px: 6,
            py: 2,
            fontSize: "1.2rem",
            fontWeight: "bold",
            borderRadius: "50px"
          }}
          onClick={() => navigate("/appointment")}
        >
          {t('about.bookOnline')}
        </Button>
      </Box>
    </Box>
  );
}