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
import { colors } from "../../utils/colors";
import LoadingScreen from "../../components/Loading";
import { useAuth } from "../../context/AuthContext";
import type { User } from "../../Interfaces/User";
import type { UserUpdate } from "../../Interfaces/UserUpdate";


// function decodeJwt(token: string) {
//   try {
//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split("")
//         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//         .join("")
//     );
//     return JSON.parse(jsonPayload);
//   } catch {
//     return null;
//   }
// }

export default function ProfilePage() {
  const { t } = useTranslation();

  const { userId } = useAuth();

  const [userData, setUserData] = useState<User | null>(null);
  const [originalUserData, setOriginalUserData] = useState<User | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userData) return;
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!userData || !originalUserData) return;

    // const token = localStorage.getItem("token");
    // if (!token) return;

    // const claims = decodeJwt(token);
    // const userId = claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

    const dto: UserUpdate = {
      name: userData.name,
      surname: userData.surname,
      phoneNumber: userData.phoneNumber,
      email: userData.email,
    };

    try {
      const response = await api.put(`/api/User/edit/${userId}`, dto);
      console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA ", response.data);

      setUserData(response.data);
      setOriginalUserData(response.data);
      setIsEditing(false);

      alert("Dane zostały zapisane");
    } catch (err: any) {
      console.error("Błąd zapisu:", err.response?.data || err);
      alert("Nie udało się zapisać zmian");
    }
  };

  const handleCancel = () => {
    setUserData(originalUserData);
    setIsEditing(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Brak tokena");
          setLoading(false);
          return;
        }

        // const claims = decodeJwt(token);
        // if (!claims) {
        //   setError("Niepoprawny token");
        //   setLoading(false);
        //   return;
        // }

        // const userId =
        //   claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];



        const response = await api.get(`/api/User/${userId}`);
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA ", response.data);
        setUserData(response.data);
        setOriginalUserData(response.data);

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
        <UserNavigation />
        <CircularProgress sx={{ color: colors.color5, mr: 2 }} />
        <Typography>Ładowanie danych...</Typography>
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

  if (loading) {
    return <LoadingScreen />
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
                { name: "name", label: t("userProfile.firstName") },
                { name: "surname", label: t("userProfile.lastName") },
                { name: "email", label: t("userProfile.email") },
                { name: "phoneNumber", label: t("userProfile.phone") },
              ].map((field) => (
                //@ts-ignore
                <Grid item xs={12} sm={6} key={field.name}>
                  <TextField
                    fullWidth
                    name={field.name}
                    label={field.label}
                    value={(userData as any)[field.name] || ""}
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
                    onClick={handleCancel}
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
