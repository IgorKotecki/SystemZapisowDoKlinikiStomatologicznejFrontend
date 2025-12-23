import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Avatar,
  IconButton,
  Alert,
} from "@mui/material";
import { Camera } from "lucide-react";
import { useTranslation } from "react-i18next";
import UserNavigation from "../../components/userComponents/userNavigation";
import api from "../../api/axios";
import post from "../../api/post";
import { colors } from "../../utils/colors";
import LoadingScreen from "../../components/Loading";
import { useAuth } from "../../context/AuthContext";
import type { User } from "../../Interfaces/User";
import type { UserUpdate } from "../../Interfaces/UserUpdate";

export default function ReceptionistProfile() {
  const { t } = useTranslation();
  const { userId, updateUserPhoto } = useAuth();

  const [userData, setUserData] = useState<User | null>(null);
  const [originalUserData, setOriginalUserData] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const mapUserData = (data: any): User => ({
    ...data,
    photoUrl: data.photoURL || data.photoUrl,
  });

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/api/User/${userId}`);
        const mappedData = mapUserData(response.data);
        setUserData(mappedData);
        setOriginalUserData(mappedData);
      } catch (err) {
        console.error("Błąd pobierania danych:", err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchUserData();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userData) return;
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImageToCloudinary = async (file: File) => {
    try {
      const data = await post.updatePhoto(file);
      return data;
    } catch (err) {
      console.error("Cloudinary error:", err);
      throw err;
    }
  };

  const handleSave = async () => {
    if (!userData) return;
    setUploading(true);

    try {
      let finalPhotoUrl = userData.photoUrl;

      if (selectedFile) {
        finalPhotoUrl = await uploadImageToCloudinary(selectedFile);
      }

      const dto: UserUpdate & { PhotoURL?: string } = {
        name: userData.name,
        surname: userData.surname,
        phoneNumber: userData.phoneNumber,
        email: userData.email,
        PhotoURL: finalPhotoUrl,
      };

      const response = await api.put(`/api/User/edit/${userId}`, dto);
      const mappedUpdatedData = mapUserData(response.data);
    
      updateUserPhoto(mappedUpdatedData.photoUrl); 
      
      setUserData(mappedUpdatedData);
      setOriginalUserData(mappedUpdatedData);
      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setAlert({
        type: "success",
        message: t("userProfile.saveSuccess")
      });
    } catch (err: any) {
      console.error("Błąd zapisu:", err);
      setAlert({
        type: "error",
        message: t("userProfile.saveError")
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setUserData(originalUserData);
    setPreviewUrl(null);
    setSelectedFile(null);
    setIsEditing(false);
  };

  if (loading) return <LoadingScreen />;

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, width: "100%", minHeight: "100vh", backgroundColor: colors.color1 }}>
      <UserNavigation />

      <Box component="main" sx={{ flex: 1, px: { xs: 2, md: 8 }, py: 6, display: "flex", flexDirection: "column", alignItems: "center", color: colors.white }}>
        <Box sx={{ width: "100%", maxWidth: 1000 }}>
          <Typography variant="h4" gutterBottom sx={{ color: colors.color5, fontWeight: "bold", mb: 4 }}>
            {t("receptionistProfile.title")}
          </Typography>
          <Paper elevation={6} sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, backgroundColor: colors.color2 }}>
            <Grid container spacing={6} alignItems="center">

              <Grid size={{ xs: 12, md: 5 }} component="div" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src={previewUrl || userData?.photoUrl}
                    sx={{
                      width: { xs: 160, md: 240 },
                      height: { xs: 160, md: 240 },
                      border: `5px solid ${colors.color5}`,
                      boxShadow: "0px 8px 24px rgba(0,0,0,0.4)",
                      backgroundColor: colors.color3,
                      fontSize: "4rem"
                    }}
                  >
                    {userData?.name?.charAt(0)}{userData?.surname?.charAt(0)}
                  </Avatar>

                  {isEditing && (
                    <IconButton
                      component="label"
                      sx={{
                        position: "absolute",
                        bottom: 15,
                        right: 15,
                        backgroundColor: colors.color5,
                        color: colors.color1,
                        boxShadow: 3,
                        "&:hover": { backgroundColor: colors.color4, transform: "scale(1.1)" },
                        transition: "0.2s"
                      }}
                    >
                      <Camera size={26} />
                      <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                    </IconButton>
                  )}
                </Box>
                <Typography variant="subtitle1" sx={{ mt: 3, opacity: 0.8, color: colors.color5, fontWeight: 500 }}>
                  {isEditing ? t("userProfile.changePhoto") : ""}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 7 }} component="div">
                <Grid container spacing={3}>
                  {[
                    { name: "name", label: t("userProfile.firstName") },
                    { name: "surname", label: t("userProfile.lastName") },
                    { name: "email", label: t("userProfile.email") },
                    { name: "phoneNumber", label: t("userProfile.phone") },
                  ].map((field) => (
                    <Grid size={{ xs: 12 }} component="div" key={field.name}>
                      <TextField
                        fullWidth
                        name={field.name}
                        label={field.label}
                        value={(userData as any)?.[field.name] || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        variant="outlined"
                        sx={{
                          backgroundColor: colors.white,
                          borderRadius: 2,
                          "& .MuiInputBase-input": { color: colors.color1, py: 1.8 },
                          "& .MuiInputLabel-root": { color: "rgba(0,0,0,0.6)" },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { border: "none" },
                            "&:hover fieldset": { border: "none" },
                            "&.Mui-focused fieldset": { border: `2px solid ${colors.color5}` },
                          },
                          "& .Mui-disabled": {
                            backgroundColor: "rgba(255,255,255,0.8)",
                            "-webkit-text-fill-color": "rgba(0,0,0,0.7) !important"
                          }
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
            <Box sx={{ mt: 6, display: "flex", gap: 3, justifyContent: "center" }}>
              {!isEditing ? (
                <Button
                  variant="contained"
                  onClick={() => setIsEditing(true)}
                  sx={{
                    backgroundColor: colors.color5,
                    color: colors.color1,
                    px: 8, py: 1.8,
                    fontWeight: "bold",
                    borderRadius: "50px",
                    fontSize: "1rem",
                    textTransform: "none",
                    "&:hover": { backgroundColor: colors.color4, transform: "translateY(-2px)" },
                    transition: "0.3s"
                  }}
                >
                  {t("receptionistProfile.edit")}
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    disabled={uploading}
                    onClick={handleSave}
                    sx={{
                      backgroundColor: colors.color5,
                      color: colors.color1,
                      px: 5, py: 1.8,
                      fontWeight: "bold",
                      borderRadius: "50px",
                      textTransform: "none",
                      "&:hover": { backgroundColor: colors.color4 }
                    }}
                  >
                    {uploading ? <CircularProgress size={24} color="inherit" /> : t("receptionistProfile.save")}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    sx={{
                      borderColor: colors.color5,
                      color: colors.color5,
                      px: 5, py: 1.8,
                      borderRadius: "50px",
                      textTransform: "none",
                      "&:hover": { borderColor: colors.color4, color: colors.color4, backgroundColor: "rgba(255,255,255,0.05)" }
                    }}
                  >
                    {t("receptionistProfile.cancel")}
                  </Button>
                </>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
      {alert && (
        <Alert
          severity={alert.type}
          variant="filled"
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9999,
            minWidth: 300,
            boxShadow: "0px 4px 12px rgba(0,0,0,0.5)"
          }}
        >
          {alert.message}
        </Alert>
      )}
    </Box>
  );
}