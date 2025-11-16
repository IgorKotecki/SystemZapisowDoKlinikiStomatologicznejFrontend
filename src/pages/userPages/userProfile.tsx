import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import UserNavigation from "../../components/userComponents/userNavigation";
import api from "../../api/axios";

interface userDTO {
  id: number;
  name: string;
  surename: string;
  email: string;
  phoneNumber: string;
  roleName: string;
}

const colors = {
  color1: "#003141",
  color2: "#004f5f",
  color3: "#007987",
  color4: "#00b2b9",
  color5: "#00faf1",
  white: "#ffffff",
};

function decodeJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function ProfilePage() {
  const { t } = useTranslation();

  const [userData, setUserData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const claims = decodeJwt(token);
      const userId =
        claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

      const dto = {
        name: userData.name,
        surname: userData.surname || userData.surename,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
      };

      const response = await api.put(`api/User/${userId}`, dto);

      setUserData(response.data);
      setIsEditing(false);
      alert("Dane zostały zapisane!");
    } catch (err: any) {
      console.error("Błąd zapisu:", err.response?.data || err);
      alert("Nie udało się zapisać zmian");
    }
  };



  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("Brak tokena");
          setError("Brak tokena");
          setLoading(false);
          return;
        }

        const claims = decodeJwt(token);
        if (!claims) {
          console.log("Niepoprawny token");
          setError("Niepoprawny token");
          setLoading(false);
          return;
        }

        const userId =
          claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        if (!userId) {
          setError("Brak ID użytkownika w tokenie");
          setLoading(false);
          return;
        }

        const response = await api.get(`api/User/${userId}`);
        const data: userDTO[] = response.data;

        setUserData(data);
        setError(null);
      } catch (err) {
        console.error("Błąd pobierania danych:", err);
        setError("Nie udało się pobrać danych użytkownika");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: colors.color1,
          color: colors.white,
        }}
      >
        <CircularProgress sx={{ color: colors.color5, mr: 2 }} />
        <Typography>{t("userProfile.loading") || "Ładowanie danych..."}</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: colors.color1,
          color: colors.white,
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{ backgroundColor: colors.color3, color: colors.white }}
        >
          Odśwież
        </Button>
      </Box>
    );
  }

  if (!userData) {
    return null;
  }

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
            {t("userProfile.profile")}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            {t("userProfile.pageInfo")}
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
                { name: "name", label: t("userProfile.firstName"), type: "text" },
                { name: "surname", label: t("userProfile.lastName"), type: "text" },
                { name: "email", label: t("userProfile.email"), type: "email" },
                { name: "phoneNumber", label: t("userProfile.phone"), type: "tel" },
              ].map((field) => (
                <Grid item xs={12} sm={6} key={field.name}>
                  <TextField
                    fullWidth
                    name={field.name}
                    label={field.label}
                    type={field.type}
                    value={userData?.[field.name] || ""}
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
                  {t("userProfile.edit")}
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
                    {t("userProfile.save")}
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
                    {t("userProfile.cancel")}
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
