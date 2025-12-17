import type React from "react"

import { Box, Typography, Button, Grid, Card, CardContent, TextField, Paper } from "@mui/material"
// import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PhoneIcon from "@mui/icons-material/Phone"
import EmailIcon from "@mui/icons-material/Email"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import { useState } from "react"
import { colors } from "../utils/colors"

export default function Contact() {
  // const { t } = useTranslation()
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
    // Handle form submission logic here
    console.log("Form submitted:", formData)
  }

  return (
    <Box sx={{ width: "100vw", minHeight: "100vh", backgroundColor: colors.white }}>
      <Box
        sx={{
          width: "100%",
          height: { xs: "70vh", md: "90vh" },
          backgroundImage: 'url("/images/dental-contact.jpg")',
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
              Skontaktuj się z nami
            </Typography>
            <Typography variant="h6" gutterBottom>
              Jesteśmy tutaj, aby odpowiedzieć na wszystkie Twoje pytania i umówić wizytę.
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
            >
              +48 123 456 789
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ py: 8, px: { xs: 2, md: 4 }, backgroundColor: "#f5f5f5" }}>
        <Grid container spacing={6}>
          {/* Contact Information */}
          {/* <Grid item xs={12} md={6}> */}
          <Grid size={{ xs: 12, md: 6 }} component="div">
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
              Informacje kontaktowe
            </Typography>

            <Grid container spacing={3}>
              {/* <Grid item xs={12}> */}
              <Grid size={{ xs: 12, md: 5 }} component="div">
                <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                  <CardContent sx={{ display: "flex", alignItems: "center", p: 3 }}>
                    <LocationOnIcon sx={{ color: colors.color3, fontSize: "2rem", mr: 2 }} />
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Adres
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        ul. Stomatologiczna 15
                        <br />
                        00-001 Warszawa
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* <Grid item xs={12}> */}
              <Grid size={{ xs: 12, md: 5 }} component="div">
                <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                  <CardContent sx={{ display: "flex", alignItems: "center", p: 3 }}>
                    <PhoneIcon sx={{ color: colors.color3, fontSize: "2rem", mr: 2 }} />
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Telefon
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        +48 123 456 789
                        <br />
                        +48 987 654 321
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* <Grid item xs={12}> */}
              <Grid size={{ xs: 12, md: 5 }} component="div">
                <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                  <CardContent sx={{ display: "flex", alignItems: "center", p: 3 }}>
                    <EmailIcon sx={{ color: colors.color3, fontSize: "2rem", mr: 2 }} />
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Email
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        kontakt@klinikadental.pl
                        <br />
                        recepcja@klinikadental.pl
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* <Grid item xs={12}> */}
              <Grid size={{ xs: 12, md: 5 }} component="div">
                <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                  <CardContent sx={{ display: "flex", alignItems: "center", p: 3 }}>
                    <AccessTimeIcon sx={{ color: colors.color3, fontSize: "2rem", mr: 2 }} />
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Godziny otwarcia
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Pon-Pt: 8:00 - 20:00
                        <br />
                        Sobota: 9:00 - 15:00
                        <br />
                        Niedziela: Zamknięte
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Contact Form */}
          {/* <Grid item xs={12} md={6}> */}
          <Grid size={{ xs: 12, md: 5 }} component="div">
            <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
              Napisz do nas
            </Typography>

            <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 2 }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* <Grid item xs={12}> */}
                  <Grid size={{ xs: 12 }} component="div">
                    <TextField
                      fullWidth
                      label="Imię i nazwisko"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&.Mui-focused fieldset": {
                            borderColor: colors.color3,
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: colors.color3,
                        },
                      }}
                    />
                  </Grid>
                  {/* <Grid item xs={12}> */}
                  <Grid size={{ xs: 12 }} component="div">
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&.Mui-focused fieldset": {
                            borderColor: colors.color3,
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: colors.color3,
                        },
                      }}
                    />
                  </Grid>
                  {/* <Grid item xs={12}> */}
                  <Grid size={{ xs: 12 }} component="div">
                    <TextField
                      fullWidth
                      label="Telefon"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&.Mui-focused fieldset": {
                            borderColor: colors.color3,
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: colors.color3,
                        },
                      }}
                    />
                  </Grid>
                  {/* <Grid item xs={12}> */}
                  <Grid size={{ xs: 12 }} component="div">
                    <TextField
                      fullWidth
                      label="Wiadomość"
                      name="message"
                      multiline
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "&.Mui-focused fieldset": {
                            borderColor: colors.color3,
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: colors.color3,
                        },
                      }}
                    />
                  </Grid>
                  {/* <Grid item xs={12}> */}
                  <Grid size={{ xs: 12, md: 5 }} component="div">
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      sx={{
                        backgroundColor: colors.color3,
                        "&:hover": { backgroundColor: colors.color4 },
                        textTransform: "none",
                        py: 1.5,
                      }}
                    >
                      Wyślij wiadomość
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Map Section */}
      <Box sx={{ py: 6, px: { xs: 2, md: 4 }, backgroundColor: colors.white }}>
        <Typography variant="h4" textAlign="center" gutterBottom sx={{ mb: 4 }}>
          Znajdź nas
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2, width: "100%", maxWidth: "800px" }}>
            <Box
              sx={{
                width: "100%",
                height: "400px",
                backgroundColor: "#f0f0f0",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" color="text.secondary">
                [Tutaj będzie mapa Google Maps]
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}
