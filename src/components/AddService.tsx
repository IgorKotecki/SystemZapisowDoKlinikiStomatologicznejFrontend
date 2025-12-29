import React, { useState } from "react";
import {
  Modal,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { colors } from "../utils/colors";
import type { ServiceCategory } from "../Interfaces/ServiceCategory";
import post from "../api/post";

interface AddServiceModalProps {
  open: boolean;
  onClose: () => void;
  categories: ServiceCategory[];
  onSuccess: () => void;
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({ open, onClose, categories, onSuccess }) => {
  const { t, i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialServiceState = {
    lowPrice: 0,
    highPrice: 0,
    minTime: 30,
    serviceCategoriesId: [] as number[],
    rolePermissionIds: [1, 2],
    languages: [
      { code: "pl", name: "", description: "" },
      { code: "en", name: "", description: "" },
    ],
  };

  const [newService, setNewService] = useState(initialServiceState);

  const updateLangField = (code: string, field: "name" | "description", value: string) => {
    setNewService(prev => ({
      ...prev,
      languages: prev.languages.map(l => l.code === code ? { ...l, [field]: value } : l)
    }));
  };

  const handleAddService = async () => {
    setIsSubmitting(true);
    try {
      await post.addNewService(newService);
      setNewService(initialServiceState);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Błąd podczas dodawania usługi");
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
      <Paper sx={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: { xs: "95%", md: 700 }, maxHeight: "90vh", overflowY: "auto",
        p: 4, backgroundColor: colors.color2, color: colors.white, borderRadius: 3,
      }}>
        <Typography variant="h5" sx={{ color: colors.color5, mb: 4, fontWeight: 'bold' }}>
          {t("receptionistServices.addNewTitle")}
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" sx={{ color: colors.color5, fontWeight: 'bold', borderBottom: `1px solid ${colors.color3}`, mb: 1 }}>
              {t("receptionistServices.polishSection")}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label={t("receptionistServices.name")} sx={textFieldStyle}
              value={newService.languages.find(l => l.code === "pl")?.name}
              onChange={(e) => updateLangField("pl", "name", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth multiline rows={1} label={t("receptionistServices.description")} sx={textFieldStyle}
              value={newService.languages.find(l => l.code === "pl")?.description}
              onChange={(e) => updateLangField("pl", "description", e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" sx={{ color: colors.color5, fontWeight: 'bold', borderBottom: `1px solid ${colors.color3}`, mt: 2, mb: 1 }}>
              {t("receptionistServices.englishSection")}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label={t("receptionistServices.name")} sx={textFieldStyle}
              value={newService.languages.find(l => l.code === "en")?.name}
              onChange={(e) => updateLangField("en", "name", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth multiline rows={1} label={t("receptionistServices.description")} sx={textFieldStyle}
              value={newService.languages.find(l => l.code === "en")?.description}
              onChange={(e) => updateLangField("en", "description", e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" sx={{ color: colors.color5, fontWeight: 'bold', borderBottom: `1px solid ${colors.color3}`, mt: 2, mb: 1 }}>
              {t("receptionistServices.technicalDetails")}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField fullWidth type="number" label={t("receptionistServices.minPrice")} sx={textFieldStyle}
              value={newService.lowPrice} onChange={(e) => setNewService({ ...newService, lowPrice: Number(e.target.value) })}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField fullWidth type="number" label={t("receptionistServices.maxPrice")} sx={textFieldStyle}
              value={newService.highPrice} onChange={(e) => setNewService({ ...newService, highPrice: Number(e.target.value) })}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField fullWidth type="number" label={t("receptionistServices.time")} sx={textFieldStyle}
              value={newService.minTime} onChange={(e) => setNewService({ ...newService, minTime: Number(e.target.value) })}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField select fullWidth label={t("receptionistServices.category")} sx={textFieldStyle}
              value={newService.serviceCategoriesId[0] || ""}
              onChange={(e) => setNewService({ ...newService, serviceCategoriesId: [Number(e.target.value)] })}
            >
              {categories.map(c => (
                <MenuItem key={c.id} value={c.id}>{i18n.language === "pl" ? c.namePl : c.nameEn}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 6 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button onClick={onClose} sx={{ color: colors.white }}>{t("userProfile.cancel")}</Button>
            <Button
              variant="contained"
              onClick={handleAddService}
              disabled={isSubmitting}
              sx={{ backgroundColor: colors.color5, color: colors.color1, fontWeight: 'bold', px: 4 }}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : t("userProfile.save")}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
};

export default AddServiceModal;