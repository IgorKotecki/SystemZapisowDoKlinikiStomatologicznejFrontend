import React, { useState, useEffect, useMemo } from "react";
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
import ToothDiagram from "./TeethModel";
import type { ToothData } from "../Interfaces/ToothData";
import i18n from "../i18n";

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

function getUserRoleFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return "Unregistered";
  const claims = decodeJwt(token);
  if (!claims) return "Unregistered";

  const msRole =
    claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  const simpleRole =
    claims.role || (Array.isArray(claims.roles) ? claims.roles[0] : null);

  const role = msRole || simpleRole || "Unregistered";

  if (typeof role === "string") {
    const r = role.toLowerCase();
    if (r.includes("admin")) return "Admin";
    if (r.includes("user") || r.includes("registered")) return "User";
    if (r.includes("receptionist")) return "Receptionist";
    if (r.includes("doctor")) return "Doctor";
  }

  return "Unregistered";
}

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
  const [teeth, setTeeth] = useState<ToothData[]>([]);
  const role = useMemo(() => getUserRoleFromToken(), []);

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const fetchTeethModel = async (userId: number) => {
    try {
      const language = i18n.language;
      const teethData = await get.getTeethModel(userId, language);
      setTeeth(teethData);
    } catch (err) {
      showAlert({
        type: "error",
        message: t("editUser.fetchTeethError"),
      });
    }
  };

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
      fetchTeethModel(userId);
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
          width: { xs: "95%", md: 800 },
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={t("receptionistUsers.firstName")}
                sx={textFieldStyle}
                value={userData.name || ""}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label={t("receptionistUsers.lastName")}
                sx={textFieldStyle}
                value={userData.surname || ""}
                onChange={(e) => setUserData({ ...userData, surname: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Email"
                sx={textFieldStyle}
                value={userData.email || ""}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label={t("receptionistUsers.phone")}
                sx={textFieldStyle}
                value={userData.phoneNumber || ""}
                onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
              />
            </Grid>
            {role === "Doctor" && (
            <Box sx= {{ justifyContent: "center", display: "flex", width: "100%"}}>
              <ToothDiagram teeth={teeth} />
            </Box>
            )}
            <Grid size={{ xs: 12 }}>
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