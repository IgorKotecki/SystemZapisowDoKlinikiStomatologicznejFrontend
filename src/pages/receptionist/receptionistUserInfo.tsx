import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import UserNavigation from "../../components/userComponents/userNavigation";
import { colors } from "../../utils/colors";
import type { User } from "../../Interfaces/User";
import { useAuth } from "../../context/AuthContext";

const EditUser: React.FC = () => {
  const { login , userRole} = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = Number(id);

  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUserData({
          id: userId,
          firstName: "Jan",
          lastName: "Kowalski",
          phone: "+48 600 111 222",
          email: "jan.kowalski@example.com",
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userData) {
      setUserData({ ...userData, [e.target.name]: e.target.value });
    }
  };

  const handleSave = () => {
    alert(t("editUser.saved"));
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: colors.color1,
        }}
      >
        <CircularProgress sx={{ color: colors.color5 }} />
      </Box>
    );
  }

  if (!userData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: colors.color1,
          color: colors.white,
        }}
      >
        <Typography variant="h5">{t("editUser.notFound")}</Typography>
      </Box>
    );
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
          color: colors.white,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 1500 }}>
          <Button
            startIcon={<ArrowLeft />}
            onClick={() => {
              // const claims = jwtDecode(localStorage.getItem("token"))
              const role = userRole  //claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
              if (role == "Doctor") {
                navigate(`/doctor/users`);
              } else if (role == "Receptionist") {
                navigate(`/receptionist/users`);
              }
              //navigate("/receptionist/users")
            }}
            sx={{
              mb: 3,
              color: colors.color5,
              "&:hover": { backgroundColor: colors.color3 },
            }}
          >
            {t("editUser.goBack")}
          </Button>

          <Typography variant="h4" gutterBottom sx={{ color: colors.color5 }}>
            {t("editUser.title")}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            {t("editUser.subtitle")}
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
              {["firstName", "lastName", "email", "phone"].map((field) => (
                // <Grid item xs={12} sm={6} key={field}>
                <Grid key={field} size={{xs: 12, sm: 6}}>
                  <TextField
                    fullWidth
                    name={field}
                    label={t(`editUser.${field}`)}
                    value={userData[field as keyof User]}
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
                  {t("editUser.edit")}
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
                    {t("editUser.save")}
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
                    {t("editUser.cancel")}
                  </Button>
                </>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default EditUser;
