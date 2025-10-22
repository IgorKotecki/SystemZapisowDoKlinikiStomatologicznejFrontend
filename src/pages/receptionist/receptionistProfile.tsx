import React, { useState } from "react";
import { Box, Typography, TextField, Button, Grid, Paper } from "@mui/material";
import UserNavigation from "../../components/userComponents/userNavigation";
import { useTranslation } from "react-i18next";

const colors = {
  color1: "#003141",
  color2: "#004f5f",
  color3: "#007987",
  color4: "#00b2b9",
  color5: "#00faf1",
  white: "#ffffff",
};

export default function ReceptionistProfile() {
  const { t } = useTranslation();

  const [profileData, setProfileData] = useState({
    firstName: "Anna",
    lastName: "Nowak",
    email: "anna.nowak@dentalcare.pl",
    phone: "+48 600 123 456",
    position: t("receptionistProfile.positionValue"),
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    alert(t("receptionistProfile.saved"));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        width: "100%",
        minHeight: "100vh",
        backgroundColor: colors.color1,
      }}
    >
      <UserNavigation />

      <Box
        component="main"
        sx={{
          flex: 1,
          px: { xs: 2, md: 8 },
          py: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: colors.white,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 1500 }}>
          <Typography variant="h4" gutterBottom sx={{ color: colors.color5 }}>
            {t("receptionistProfile.title")}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            {t("receptionistProfile.subtitle")}
          </Typography>

          <Paper
            elevation={4}
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: colors.color2,
            }}
          >
            <Grid container spacing={3}>
              {[
                { name: "firstName", label: t("receptionistProfile.firstName") },
                { name: "lastName", label: t("receptionistProfile.lastName") },
                { name: "email", label: t("receptionistProfile.email") },
                { name: "phone", label: t("receptionistProfile.phone") },
                { name: "position", label: t("receptionistProfile.position") },
              ].map((field) => (
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
              }}
            >
              {!isEditing ? (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: colors.color3,
                    color: colors.white,
                    "&:hover": { backgroundColor: colors.color4 },
                  }}
                  onClick={() => setIsEditing(true)}
                >
                  {t("receptionistProfile.edit")}
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: colors.color3,
                      color: colors.white,
                      "&:hover": { backgroundColor: colors.color4 },
                    }}
                    onClick={handleSave}
                  >
                    {t("receptionistProfile.save")}
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: colors.color3,
                      color: colors.white,
                      "&:hover": {
                        backgroundColor: colors.color4,
                        borderColor: colors.color4,
                      },
                    }}
                    onClick={() => setIsEditing(false)}
                  >
                    {t("receptionistProfile.cancel")}
                  </Button>
                </>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
