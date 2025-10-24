import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import UserNavigation from "../../components/userComponents/userNavigation";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
// import api from "../../api/axios";

const colors = {
  color1: "#003141",
  color2: "#004f5f",
  color3: "#007987",
  color4: "#00b2b9",
  color5: "#00faf1",
  white: "#ffffff",
};

interface Service {
  id: number;
  name: string;
  price: number;
}

const ReceptionistServices: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // const response = await api.get("/api/services");
        // setServices(response.data);

        setServices([
          { id: 1, name: "Wybielanie zębów", price: 300 },
          { id: 2, name: "Czyszczenie kamienia", price: 150 },
          { id: 3, name: "Leczenie kanałowe", price: 500 },
          { id: 4, name: "Plomba kompozytowa", price: 200 },
        ]);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleServiceClick = (serviceId: number) => {
    navigate(`/receptionist/services/${serviceId}`);
  };

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
          <Typography variant="h4" gutterBottom sx={{ color: colors.color5 }}>
            {t("receptionistServices.title")}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 3 }}>
            {t("receptionistServices.subtitle")}
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress sx={{ color: colors.color5 }} />
            </Box>
          ) : (
            <Paper
              elevation={4}
              sx={{
                borderRadius: 3,
                backgroundColor: colors.color2,
                overflow: "hidden",
              }}
            >
              <Box sx={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: colors.color3 }}>
                      {["id", "name", "price"].map((key) => (
                        <th
                          key={key}
                          style={{
                            padding: "16px",
                            textAlign: "left",
                            color: colors.white,
                            fontWeight: 600,
                          }}
                        >
                          {t(`receptionistServices.${key}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr
                        key={service.id}
                        onClick={() => handleServiceClick(service.id)}
                        style={{
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          backgroundColor: colors.color2,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = colors.color3)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = colors.color2)
                        }
                      >
                        <td style={{ padding: "16px", color: colors.white }}>{service.id}</td>
                        <td style={{ padding: "16px", color: colors.white }}>{service.name}</td>
                        <td style={{ padding: "16px", color: colors.white }}>{service.price} zł</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ReceptionistServices;
