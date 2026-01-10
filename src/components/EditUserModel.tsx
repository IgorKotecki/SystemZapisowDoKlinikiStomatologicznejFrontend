import React, { useState, useEffect } from "react";
import {
  Modal,
  Paper,
  Typography,
  Grid,
  TextField,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { colors } from "../utils/colors";
import type { User } from "../Interfaces/User";
import get from "../api/get";
import put from "../api/put";
import { showAlert } from "../utils/GlobalAlert"; 

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  userId: number | null;
  onSuccess: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ open, onClose, userId, onSuccess }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  useEffect(() => {
    if (open && userId) {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const data = await get.getUserById(userId);
          setUserData(data);
        } catch (err) {
          showAlert({
            type: "error",
            message: t("editUser.fetchError"),
          });
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [open, userId, t]);

  const handleSave = async () => {
    if (!userData || !userId) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const purePhone = (userData.phoneNumber || "").replace(/\D/g, "");

    if (!(userData.name || "").trim() || !(userData.surname || "").trim()) {
      showAlert({
        type: "error",
        message: t("editUser.errorEmptyNames"),
      });
      return;
    }

    if (!emailRegex.test(userData.email || "")) {
      showAlert({
        type: "error",
        message: t("editUser.errorInvalidEmail"),
      });
      return;
    }

    if (purePhone.length < 9) {
      showAlert({
        type: "error",
        message: t("editUser.errorPhoneTooShort"),
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const dto = {
        ...userData,
        name: capitalize(userData.name.trim()),
        surname: capitalize(userData.surname.trim()),
        phoneNumber: purePhone,
      };

      await put.updateUserById(userId, dto);
      
      showAlert({
        type: "success",
        message: t("editUser.saveSuccess"),
      });
      
      onSuccess();
      onClose();
    } catch (err) {
      showAlert({
        type: "error",
        message: t("editUser.saveError"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const textFieldStyle = {
    backgroundColor: colors.white,
    borderRadius: 1,
    "& .MuiInputBase-input": { color: colors.color1 },
    "& .MuiInputLabel-root": { color: colors.color2 },
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", md: 600 },
          p: 4,
          backgroundColor: colors.color2,
          color: colors.white,
          borderRadius: 3,
          boxShadow: 24,
        }}
      >
        <Typography variant="h5" sx={{ color: colors.color5, mb: 4, fontWeight: "bold" }}>
          {t("editUser.title")}
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress color="inherit" />
          </Box>
        ) : userData ? (
          <Grid container spacing={3}>
            <Grid size={{xs:12, sm:6}}>
              <TextField
                fullWidth
                label={t("receptionistUsers.firstName")}
                sx={textFieldStyle}
                value={userData.name || ""}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              />
            </Grid>
            <Grid size={{xs:12, sm:6}}>
              <TextField
                fullWidth
                label={t("receptionistUsers.lastName")}
                sx={textFieldStyle}
                value={userData.surname || ""}
                onChange={(e) => setUserData({ ...userData, surname: e.target.value })}
              />
            </Grid>
            <Grid size={{xs:12, sm:6}}>
              <TextField
                fullWidth
                label="Email"
                sx={textFieldStyle}
                value={userData.email || ""}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              />
            </Grid>
            <Grid size={{xs:12}}>
              <TextField
                fullWidth
                label={t("receptionistUsers.phone")}
                sx={textFieldStyle}
                value={userData.phoneNumber || ""}
                onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
              />
            </Grid>

            <Grid size={{xs:12}}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
                <Button onClick={onClose} sx={{ color: colors.white }}>
                  {t("userProfile.cancel")}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={isSubmitting}
                  sx={{
                    backgroundColor: colors.color5,
                    color: colors.color1,
                    fontWeight: "bold",
                    px: 4,
                    "&:hover": { backgroundColor: colors.color4 },
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    t("userProfile.save")
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        ) : null}
      </Paper>
    </Modal>
  );
};

export default EditUserModal;