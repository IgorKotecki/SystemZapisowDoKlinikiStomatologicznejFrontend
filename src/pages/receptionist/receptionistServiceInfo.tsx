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
// import api from "../../api/axios";

const colors = {
  color1: "#003141",
  color2: "#004f5f",
  color3: "#007987",
  color4: "#00b2b9",
  color5: "#00faf1",
  white: "#ffffff",
};

interface ServiceData {
  id: number;
  name: string;
  price: number;
  duration: number;
  description: string;
}

const EditService: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const serviceId = Number(id);

  const [serviceData, setServiceData] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        // const response = await api.get(`/api/services/${serviceId}`);
        // setServiceData(response.data);

        setServiceData({
          id: serviceId,
          name: "Wybielanie zębów",
          price: 300,
          duration: 60,
          description: "Profesjonalne wybielanie zębów z użyciem lampy LED.",
        });
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [serviceId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (serviceData) {
      setServiceData({ ...serviceData, [e.target.name]: e.target.value });
    }
  };

  const handleSave = () => {
    // await api.put(`/api/services/${serviceId}`, serviceData);
    alert(t("editService.saved"));
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
              {["name", "price", "duration", "description"].map((field) => (
                <Grid item xs={12} sm={field === "description" ? 12 : 6} key={field}>
                  <TextField
                    fullWidth
                    name={field}
                    label={t(`editService.${field}`)}
                    value={serviceData[field as keyof ServiceData]}
                    onChange={handleChange}
                    disabled={!isEditing}
                    multiline={field === "description"}
                    rows={field === "description" ? 4 : 1}
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
                  {t("editService.edit")}
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
                    {t("editService.save")}
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
