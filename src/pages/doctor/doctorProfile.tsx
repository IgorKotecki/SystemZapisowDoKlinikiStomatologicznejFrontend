import React, { useState } from "react";
import { Box, Typography, TextField, Button, Grid, Paper } from "@mui/material";
import UserNavigation from "../../components/userComponents/userNavigation";
import { useTranslation } from "react-i18next";
import { colors } from "../../utils/colors";

export default function DoctorProfile() {
  const { t } = useTranslation();

  const [profileData, setProfileData] = useState({
    firstName: "Michał",
    lastName: "Kowal",
    email: "michal.kowal@dentalcare.pl",
    phone: "+48 600 987 654",
    specialization: "Stomatolog zachowawczy",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    alert(t("doctorProfile.saved"));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100vh",
        width: "100%",
        backgroundColor: colors.color1,
      }}
    >
      <UserNavigation />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          px: { xs: 2, md: 6 },
          py: 6,
          color: colors.white,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: colors.color5 }}>
          {t("doctorProfile.title")}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4 }}>
          {t("doctorProfile.subtitle")}
        </Typography>

        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: colors.color2,
            width: "100%", // 🔹 Wypełnia całą szerokość
            boxSizing: "border-box",
          }}
        >
          <Grid container spacing={3}>
            {[
              { name: "firstName", label: t("doctorProfile.firstName") },
              { name: "lastName", label: t("doctorProfile.lastName") },
              { name: "email", label: t("doctorProfile.email") },
              { name: "phone", label: t("doctorProfile.phone") },
              { name: "specialization", label: t("doctorProfile.specialization") },
            ].map((field) => (
              //@ts-ignore
              <Grid item xs={12} sm={6} key={field.name}>
                <TextField
                  fullWidth
                  name={field.name}
                  label={field.label}
                  value={profileData[field.name as keyof typeof profileData]}
                  onChange={handleChange}
                  disabled={!isEditing}
                  sx={{
                    backgroundColor: colors.white,
                    borderRadius: 1,
                    "& .MuiInputBase-input": { color: colors.color1 },
                  }}
                />
              </Grid>
            ))}
          </Grid>

          <Box
            sx={{
              mt: 4,
              display: "flex",
              gap: 2,
              justifyContent: "flex-end",
              flexWrap: "wrap",
            }}
          >
            {!isEditing ? (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: colors.color3,
                  "&:hover": { backgroundColor: colors.color4 },
                }}
                onClick={() => setIsEditing(true)}
              >
                {t("doctorProfile.edit")}
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: colors.color3,
                    "&:hover": { backgroundColor: colors.color4 },
                  }}
                  onClick={handleSave}
                >
                  {t("doctorProfile.save")}
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: colors.color3,
                    color: colors.white,
                    "&:hover": { backgroundColor: colors.color4 },
                  }}
                  onClick={() => setIsEditing(false)}
                >
                  {t("doctorProfile.cancel")}
                </Button>
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
