import React, { isValidElement, cloneElement } from "react";
import { Box, Typography, Button, Grid, Card, CardContent, TextField, Paper } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PhoneIcon from "@mui/icons-material/Phone"
import EmailIcon from "@mui/icons-material/Email"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import { useState } from "react"
import { colors } from "../utils/colors"

export default function Contact() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

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
              {t('contactPage.title')}
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
              {t('contactPage.subtitle')}
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
                href="tel:+48123456789"
              >
                +48 123 456 789
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ py: 12, px: { xs: 3, md: 10 }, backgroundColor: "#f8f9fa" }}>
        <Grid container spacing={8} justifyContent="center">

          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="h3" gutterBottom sx={{ color: colors.color1, fontWeight: "bold", mb: 4 }}>
              {t('contactPage.infoTitle')}
            </Typography>

            <Grid container spacing={3}>
              {[
                { icon: <LocationOnIcon />, title: t('contactPage.address'), content: "ul. Stomatologiczna 15\n00-001 Warszawa" },
                { icon: <PhoneIcon />, title: t('contactPage.phone'), content: "+48 123 456 789\n+48 987 654 321" },
                { icon: <EmailIcon />, title: t('contactPage.email'), content: "kontakt@klinikadental.pl\nrecepcja@klinikadental.pl" },
                { icon: <AccessTimeIcon />, title: t('contactPage.hours'), content: t('contactPage.hoursContent') }
              ].map((item, index) => (
                <Grid size={{ xs: 12 }} key={index}>
                  <Card sx={{ borderRadius: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", transition: "0.3s", "&:hover": { transform: "translateY(-5px)" } }}>
                    <CardContent sx={{ display: "flex", alignItems: "flex-start", p: 3 }}>
                      <Box sx={{ color: colors.color3, mr: 3, mt: 0.5 }}>
                        {isValidElement(item.icon)
                          ? cloneElement(item.icon as React.ReactElement<any>, {
                            sx: { fontSize: "2.5rem" }
                          })
                          : item.icon
                        }
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: "bold", color: colors.color1, mb: 0.5 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
                          {item.content}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h3" gutterBottom sx={{ color: colors.color1, fontWeight: "bold", mb: 4 }}>
              {t('contactPage.formTitle')}
            </Typography>

            <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 5, boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label={t('contactPage.formName')}
                      name="name"
                      variant="outlined"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label={t('contactPage.formEmail')}
                      name="email"
                      type="email"
                      variant="outlined"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label={t('contactPage.formPhone')}
                      name="phone"
                      variant="outlined"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label={t('contactPage.formMessage')}
                      name="message"
                      multiline
                      rows={5}
                      variant="outlined"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      sx={{
                        backgroundColor: colors.color3,
                        "&:hover": { backgroundColor: colors.color4 },
                        textTransform: "none",
                        py: 2,
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        borderRadius: 2
                      }}
                    >
                      {t('contactPage.formSubmit')}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}