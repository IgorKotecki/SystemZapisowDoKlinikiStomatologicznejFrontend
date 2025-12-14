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
  FormControl
} from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import UserNavigation from "../../components/userComponents/userNavigation";
import api from "../../api/axios";
import { colors } from "../../utils/colors";
import type { Service } from "../../Interfaces/Service";
import type { ServiceCategory } from "../../Interfaces/ServiceCategory";
import type { ServiceEdit } from "../../Interfaces/ServiceEdit";

const EditService: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const serviceId = Number(id);

  const [serviceData, setServiceData] = useState<ServiceEdit | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const canSave = !!serviceData && serviceData.serviceCategoryIds.length === 1 && serviceData.namePl.trim().length > 0 && serviceData.nameEn.trim().length > 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serviceRes, categoriesRes] = await Promise.all([
          api.get(`/api/Service/edit/${serviceId}`),
          api.get(`/api/Service/serviceCategories`)
        ]);

        setServiceData(serviceRes.data);
        setCategories(categoriesRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serviceId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setServiceData(prev =>
      prev ? { ...prev, [name]: value } : prev
    );
  };

  const handleSave = async () => {
    try {
      await api.put(`/api/Service/editService/${serviceId}`, serviceData);
      setIsEditing(false);
    } catch (e) {
      console.error(e);
    }
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

  if (!serviceData) {
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
        <Typography variant="h5">{t("editService.notFound")}</Typography>
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
            onClick={() => navigate("/receptionist/services")}
            sx={{
              mb: 3,
              color: colors.color5,
              "&:hover": { backgroundColor: colors.color3 },
            }}
          >
            {t("editService.goBack")}
          </Button>

          <Typography variant="h4" gutterBottom sx={{ color: colors.color5 }}>
            {t("editService.title")}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            {t("editService.subtitle")}
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
              {["lowPrice", "highPrice", "minTime", "namePl", "nameEn", "descriptionPl", "descriptionEn"].map((field) => (
                <Grid key={field} size={{ xs: 12, md: 6, sm: (field === "description" ? 12 : 6) }} component="div">
                  {/* <Grid item xs={12} sm={field === "description" ? 12 : 6} key={field}> */}
                  <TextField
                    fullWidth
                    name={field}
                    label={t(`editService.${field}`)}
                    value={serviceData[field as keyof ServiceEdit]}
                    onChange={handleChange}
                    disabled={!isEditing}
                    multiline={field.includes("description")}
                    rows={field === "description" ? 4 : 1}
                    sx={{
                      backgroundColor: colors.white,
                      borderRadius: 1,
                      "& .MuiInputBase-input": { color: colors.color1 },
                    }}
                  />
                </Grid>
              ))}
              <Grid size={{ xs: 12 }} component="div">
                <FormControl fullWidth sx={{ backgroundColor: colors.white, borderRadius: 1, "& .MuiInputBase-input": { color: colors.color1 }, }} >
                  <InputLabel>{t("editService.category")}</InputLabel>
                  <Select
                    value={serviceData.serviceCategoryIds[0] ?? ""}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setServiceData(prev =>
                        prev ? { ...prev, serviceCategoryIds: [Number(e.target.value)] } : prev
                      )
                    }
                  >
                    {categories.map(c => (
                      <MenuItem key={c.id} value={c.id}>
                        {i18n.language === "pl" ? c.namePl : c.nameEn}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box
              sx={{
                mt: 4,
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                flexWrap: "wrap",
              }}
            >
              {!isEditing ? (
                <>
                  <Button
                    variant="contained"
                    onClick={() => setIsEditing(true)}
                    sx={{
                      backgroundColor: colors.color5,
                      color: colors.color1,
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: colors.color4,
                      },
                    }}
                  >
                    {t("editService.edit")}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setDeleteOpen(true)}
                    sx={{
                      color: "#d32f2f",
                      borderColor: "#d32f2f",
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "rgba(211,47,47,0.08)",
                        borderColor: "#b71c1c",
                      },
                    }}
                  >
                    {t("editService.delete")}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{
                      backgroundColor: colors.color5,
                      color: colors.color1,
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: colors.color4,
                      },
                    }}
                  >
                    {t("editService.save")}
                  </Button>

                  {/* CANCEL */}
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing(false)}
                    sx={{
                      color: colors.color5,
                      borderColor: colors.color5,
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.06)",
                      },
                    }}
                  >
                    {t("editService.cancel")}
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

export default EditService;
