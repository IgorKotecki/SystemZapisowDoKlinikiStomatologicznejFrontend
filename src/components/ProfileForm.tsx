import React, { useState } from "react";
import {
  Box, Typography, TextField, Button, Grid, Paper, 
  CircularProgress, Avatar, IconButton, Alert
} from "@mui/material";
import { Camera } from "lucide-react";
import { useTranslation } from "react-i18next";
import { colors } from "../utils/colors";
import type { User } from "../Interfaces/User";
import type { UserUpdate } from "../Interfaces/UserUpdate";
import api from "../api/axios";
import post from "../api/post";

interface UserProfileFormProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
  userId: string;
}

export default function ProfileForm({ user, onUpdate, userId }: UserProfileFormProps) {
  const { t } = useTranslation();
  const [userData, setUserData] = useState<User>(user);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setUploading(true);
    try {
      let finalPhotoUrl = userData.photoUrl;
      if (selectedFile) {
        finalPhotoUrl = await post.updatePhoto(selectedFile);
      }

      const dto: UserUpdate & { PhotoURL?: string } = {
        name: userData.name,
        surname: userData.surname,
        phoneNumber: userData.phoneNumber,
        email: userData.email,
        PhotoURL: finalPhotoUrl,
      };

      const response = await api.put(`/api/User/edit/${userId}`, dto);
      const updated = { ...response.data, photoUrl: response.data.photoURL || response.data.photoUrl };
      
      onUpdate(updated);
      setUserData(updated);
      setIsEditing(false);
      setAlert({ type: "success", message: t("userProfile.saveSuccess") });
    } catch (err) {
      setAlert({ type: "error", message: t("userProfile.saveError") });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper elevation={6} sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, backgroundColor: colors.color2 }}>
      <Grid container spacing={6} alignItems="center">
        <Grid size={{xs:12, md:7}} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={previewUrl || userData.photoUrl}
              sx={{
                width: { xs: 160, md: 240 },
                height: { xs: 160, md: 240 },
                border: `5px solid ${colors.color5}`,
                boxShadow: "0px 8px 24px rgba(0,0,0,0.4)",
                backgroundColor: colors.color3,
                fontSize: "4rem"
              }}
            >
              {userData.name?.charAt(0)}{userData.surname?.charAt(0)}
            </Avatar>
            {isEditing && (
              <IconButton
                component="label"
                sx={{
                  position: "absolute", bottom: 15, right: 15,
                  backgroundColor: colors.color5, color: colors.color1,
                  "&:hover": { backgroundColor: colors.color4, transform: "scale(1.1)" }
                }}
              >
                <Camera size={26} />
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </IconButton>
            )}
          </Box>
        </Grid>

        <Grid size={{xs:12, md:7}} >
          <Grid container spacing={3}>
            {[
              { name: "name", label: t("userProfile.firstName") },
              { name: "surname", label: t("userProfile.lastName") },
              { name: "email", label: t("userProfile.email") },
              { name: "phoneNumber", label: t("userProfile.phone") },
            ].map((field) => (
              <Grid size={{xs:12}} key={field.name}>
                <TextField
                  fullWidth
                  name={field.name}
                  label={field.label}
                  value={(userData as any)[field.name] || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  sx={{
                    backgroundColor: colors.white,
                    borderRadius: 2,
                    "& .MuiInputBase-input": { color: colors.color1 },
                    "& .MuiOutlinedInput-root": { "& fieldset": { border: "none" } }
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Box sx={{ mt: 6, display: "flex", gap: 3, justifyContent: "center" }}>
        {!isEditing ? (
          <Button variant="contained" onClick={() => setIsEditing(true)} sx={{ backgroundColor: colors.color5, px: 8 }}>
            {t("userProfile.edit")}
          </Button>
        ) : (
          <>
            <Button variant="contained" onClick={handleSave} disabled={uploading} sx={{ backgroundColor: colors.color5 }}>
              {uploading ? <CircularProgress size={24} /> : t("userProfile.save")}
            </Button>
            <Button variant="outlined" onClick={() => { setIsEditing(false); setUserData(user); }} sx={{ color: colors.color5 }}>
              {t("userProfile.cancel")}
            </Button>
          </>
        )}
      </Box>
      {alert && <Alert severity={alert.type} sx={{ position: "fixed", bottom: 16, right: 16 }}>{alert.message}</Alert>}
    </Paper>
  );
}