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
    <Box sx={{ width: "100vw", minHeight: "100vh", backgroundColor: colors.white }}>
      <Box
        sx={{
          width: "100%",
          height: { xs: "70vh", md: "90vh" },
          backgroundImage: 'url("/images/dental-about.jpg")',
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
              {t('about.aboutOutClinic')}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {t('about.aboutOutClinicText')}
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
              {t('appointment.title')}
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
              onClick={() => navigate("/team")}
            >
              {t('team')}
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ py: 8, px: { xs: 2, md: 4 }, backgroundColor: colors.color1 }}>
        <Grid container spacing={6} alignItems="center">
          {/* <Grid item xs={12} md={6} > */}
          <Grid size={{ xs: 12, md: 6 }} component="div">
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
              {t('about.ourStroy')}
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
              {t('about.storyPart1')}
            </Typography>

            <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
              {t('about.storyPart2')}
            </Typography>

            <Typography variant="body1" sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
              {t('about.storyPart3')}
            </Typography>
          </Grid>
          {/* <Grid item xs={12} md={6}> */}
          <Grid size={{ xs: 12, md: 6 }} component="div">
            <Box
              sx={{
                width: "100%",
                height: "400px",
                backgroundImage: 'url("/images/gabinet.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: 3,
                boxShadow: 3,
              }}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ py: 8, px: { xs: 2, md: 4 }, backgroundColor: colors.white }}>
        <Typography variant="h4" textAlign="center" gutterBottom sx={{ mb: 6 }}>
          {t('about.ourValues')}
        </Typography>
        <Grid container spacing={4}>
          {values.map((value, index) => (
            // <Grid item xs={12} sm={6} md={3} key={index}>
            <Grid key={index} size={{ xs: 12, md: 5 }} component="div">
              <Card sx={{ borderRadius: 3, boxShadow: 2, height: "100%", textAlign: "center" }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 2 }}>{value.icon}</Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {value.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ py: 8, px: { xs: 2, md: 4 }, backgroundColor: colors.color1, color: colors.white }}>
        <Typography variant="h4" textAlign="center" gutterBottom sx={{ mb: 6 }}>
          {t('about.ourAchievements')}
        </Typography>
        <Grid container spacing={4}>
          {achievements.map((achievement, index) => (
            // <Grid item xs={6} md={3} key={index}>
            <Grid key={index} size={{ xs: 12, md: 5 }} component="div">
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h2" sx={{ fontWeight: "bold", color: colors.color4 }}>
                  {achievement.number}
                </Typography>
                <Typography variant="h6">{achievement.label}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ py: 8, px: { xs: 2, md: 4 }, backgroundColor: "#f5f5f5" }}>
        <Typography variant="h4" textAlign="center" gutterBottom sx={{ mb: 6 }}>
          {t('about.whatPSay')}
        </Typography>
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            // <Grid item xs={12} md={4} key={index}>
            <Grid key={index} size={{ xs: 12, md: 4 }} component="div">
              <Card sx={{ borderRadius: 3, boxShadow: 2, height: "100%" }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: "flex", mb: 2 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} sx={{ color: "#ffd700", fontSize: "1.5rem" }} />
                    ))}
                  </Box>
                  <Typography variant="body1" paragraph sx={{ fontStyle: "italic" }}>
                    "{testimonial.text}"
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ bgcolor: colors.color3, mr: 2 }}>{testimonial.name.charAt(0)}</Avatar>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
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
        sx={{ py: 8, px: { xs: 2, md: 4 }, backgroundColor: colors.color3, color: colors.white, textAlign: "center" }}
      >
        <Typography variant="h4" gutterBottom>
          {t('about.readyForVisit')}
        </Typography>

        <Typography variant="h6" paragraph sx={{ mb: 4 }}>
          {t('about.joinThousands')}
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: colors.white,
            color: colors.color3,
            "&:hover": { backgroundColor: "#f0f0f0" },
            textTransform: "none",
            px: 4,
            py: 1.5,
            fontSize: "1.1rem",
          }}
          onClick={() => navigate("/appointment")}
        >
          {t('about.bookOnline')}
        </Button>
      </Box>
    </Box>
  )
}
