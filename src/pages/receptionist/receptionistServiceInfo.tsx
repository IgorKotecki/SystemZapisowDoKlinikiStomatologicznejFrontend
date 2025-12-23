import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid, 
  Paper,
  CircularProgress,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import { ArrowLeft, Upload } from "lucide-react"; 
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import UserNavigation from "../../components/userComponents/userNavigation";
import { colors } from "../../utils/colors";
import type { ServiceCategory } from "../../Interfaces/ServiceCategory";
import type { ServiceEdit } from "../../Interfaces/ServiceEdit";
import get from "../../api/get";
import put from "../../api/put";

const EditService: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const serviceId = Number(id);

  const [serviceData, setServiceData] = useState<ServiceEdit | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serviceRes, categoriesRes] = await Promise.all([
          get.getServiceById(serviceId),
          get.getServiceCategories()
        ]);
        setServiceData(serviceRes);
        setCategories(categoriesRes);
      } catch (e) {
        console.error("Błąd pobierania danych:", e);
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) fetchData();
  }, [serviceId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setServiceData(prev => prev ? { ...prev, [name]: value } : prev);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadImageToCloudinary = async (file: File) => {
    setUploading(true);
    try {
      const { signature, timestamp, cloudName, apiKey } = await get.getCloudinarySignature();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || "Cloudinary Upload Failed");
      }

      const data = await res.json();
      return { publicId: data.public_id, url: data.secure_url };
    } catch (error) {
      console.error("Cloudinary Error:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!serviceData) return;
    
    try {
      let finalPhotoUrl = serviceData.photoUrl;

      if (selectedFile) {
        const uploaded = await uploadImageToCloudinary(selectedFile);
        finalPhotoUrl = uploaded.url; 
      }

      const payload = {
        ...serviceData,
        photoUrl: finalPhotoUrl
      };

      await put.updateService(payload, serviceId);
      setServiceData(payload); 
      setIsEditing(false);
      setSelectedFile(null);
      alert(t("editService.saveSuccess") || "Zapisano pomyślnie!");
    } catch (e) {
      console.error("Błąd zapisu:", e);
      alert("Wystąpił błąd podczas zapisywania zmian.");
    }
  };

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: colors.color1 }}>
      <CircularProgress sx={{ color: colors.color5 }} />
    </Box>
  );

  if (!serviceData) return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: colors.color1, color: colors.white }}>
      <Typography variant="h5">{t("editService.notFound")}</Typography>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, width: "100%", minHeight: "100vh", backgroundColor: colors.color1 }}>
      <UserNavigation />

      <Box component="main" sx={{ flex: 1, px: { xs: 2, md: 8 }, py: 6, color: colors.white, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box sx={{ width: "100%", maxWidth: 1200 }}>
          <Button
            startIcon={<ArrowLeft />}
            onClick={() => navigate("/receptionist/services")}
            sx={{ mb: 3, color: colors.color5, "&:hover": { backgroundColor: colors.color3 } }}
          >
            {t("editService.goBack")}
          </Button>

          <Paper elevation={4} sx={{ p: 4, borderRadius: 3, backgroundColor: colors.color2 }}>
            <Grid container spacing={3}>
              {[
                { name: "namePl", label: "Nazwa (PL)" },
                { name: "nameEn", label: "Nazwa (EN)" },
                { name: "lowPrice", label: "Cena od" },
                { name: "highPrice", label: "Cena do" },
                { name: "minTime", label: "Czas trwania" },
              ].map((field) => (
                <Grid size={{ xs: 12, md: 6 }} key={field.name}>
                  <TextField
                    fullWidth
                    name={field.name}
                    label={field.label}
                    value={serviceData[field.name as keyof ServiceEdit] || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    sx={{ backgroundColor: colors.white, borderRadius: 1, "& .MuiInputBase-input": { color: colors.color1 } }}
                  />
                </Grid>
              ))}
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth sx={{ backgroundColor: colors.white, borderRadius: 1 }}>
                  <InputLabel id="category-label">{t("editService.category")}</InputLabel>
                  <Select
                    labelId="category-label"
                    value={serviceData.serviceCategoryIds[0] || ""}
                    disabled={!isEditing}
                    onChange={(e) => setServiceData({ ...serviceData, serviceCategoryIds: [Number(e.target.value)] })}
                  >
                    {categories.map(c => (
                      <MenuItem key={c.id} value={c.id}>
                        {i18n.language === "pl" ? c.namePl : c.nameEn}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  {serviceData.photoUrl && !selectedFile && (
                    <img 
                      src={serviceData.photoUrl} 
                      alt="Service" 
                      style={{ width: "100%", maxWidth: "300px", borderRadius: "8px", border: `2px solid ${colors.color5}` }} 
                    />
                  )}
                  
                  {selectedFile && (
                    <Typography sx={{ color: colors.color5 }}>
                      Wybrano nowy plik: {selectedFile.name}
                    </Typography>
                  )}

                  {isEditing && (
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<Upload />}
                      sx={{ color: colors.color5, borderColor: colors.color5 }}
                    >
                      {t("editService.uploadPhoto") || "Wybierz zdjęcie"}
                      <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "flex-end" }}>
              {isEditing ? (
                <>
                  <Button 
                    variant="contained" 
                    onClick={handleSave} 
                    disabled={uploading}
                    sx={{ backgroundColor: colors.color5, color: colors.color1 }}
                  >
                    {uploading ? <CircularProgress size={24} /> : t("editService.save")}
                  </Button>
                  <Button variant="outlined" onClick={() => { setIsEditing(false); setSelectedFile(null); }} sx={{ color: colors.white, borderColor: colors.white }}>
                    {t("editService.cancel")}
                  </Button>
                </>
              ) : (
                <Button variant="contained" onClick={() => setIsEditing(true)} sx={{ backgroundColor: colors.color5, color: colors.color1 }}>
                  {t("editService.edit")}
                </Button>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default EditService;