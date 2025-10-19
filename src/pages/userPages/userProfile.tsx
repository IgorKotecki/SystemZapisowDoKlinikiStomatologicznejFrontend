import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import UserNavigation from "../../components/userComponents/userNavigation";

const colors = {
  color1: "#003141",
  color2: "#004f5f",
  color3: "#007987",
  color4: "#00b2b9",
  color5: "#00faf1",
  white: "#ffffff",
};

export default function ProfilePage() {
   const { t } = useTranslation();

  const [userData, setUserData] = useState({
    firstName: "Jan",
    lastName: "Kowalski",
    email: "jan.kowalski@example.com",
    phone: "+48 123 456 789",
    dateOfBirth: "1990-05-15",
    address: "ul. Przykładowa 123, 00-001 Warszawa",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Dane zostały zapisane");
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
            {t('userProfile.profile')}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            {t('userProfile.pageInfo')}
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
                { name: "firstName", label: t('userProfile.firstName'), type: "text" },
                { name: "lastName", label: t('userProfile.lastName'), type: "text" },
                { name: "email", label: t('userProfile.email'), type: "email" },
                { name: "phone", label: t('userProfile.phone'), type: "tel" },
                { name: "dateOfBirth", label: t('userProfile.dateOfBirth'), type: "date" },
                { name: "address", label: t('userProfile.address'), type: "text" },
              ].map((field) => (
                <Grid item xs={12} sm={6} key={field.name}>
                  <TextField
                    fullWidth
                    name={field.name}
                    label={field.label}
                    type={field.type}
                    value={userData[field.name as keyof typeof userData]}
                    onChange={handleInputChange}
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

            <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "flex-end" }}>
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
                  {t('userProfile.edit')}
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
                    {t('userProfile.save')}
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
                    {t('userProfile.cancel')}
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
