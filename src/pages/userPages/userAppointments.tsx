import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import UserNavigation from "../../components/userComponents/userNavigation";
import api from "../../api/axios";
import { colors } from "../../utils/colors";
import { useAuth } from "../../context/AuthContext";
import type { Appointment } from "../../Interfaces/Appointment";

// function decodeJwt(token: string) {
//   try {
//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split("")
//         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//         .join("")
//     );
//     return JSON.parse(jsonPayload);
//   } catch {
//     return null;
//   }
// }

export default function VisitsHistoryPage() {
  const {userRole, userId} = useAuth();
  const { t, i18n } = useTranslation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // const token = localStorage.getItem("token");
        // console.log(token);
        // if (!token) return "Unregistered";

        // const claims = decodeJwt(token);
        // const userId = claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        
        setLoading(true);
        setError(null);
        if (!userId) {
          setError("Brak ID użytkownika");
          setLoading(false);
          return;
        }
        const lang = i18n.language || "pl";
        const response = await api.get(`/api/Appointment/User/${userId}?lang=${lang}`);
        setAppointments(response.data);
      } catch (err) {
        setError("Nie udało się pobrać wizyt.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [i18n.language]);

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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: colors.white,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 1500 }}>
          <Typography variant="h4" gutterBottom sx={{ color: colors.color5 }}>
            {t("userAppointments.title")}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            {t("userAppointments.pageInfo")}
          </Typography>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
              <CircularProgress sx={{ color: colors.color5 }} />
            </Box>
          )}

          {error && (
            <Typography sx={{ color: "red", mb: 3 }}>{error}</Typography>
          )}

          {!loading && !error && (
            <Paper
              elevation={4}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: colors.color2,
                overflowX: "auto",
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: colors.color5, fontWeight: "bold" }}>
                        {t("userAppointments.date")}
                      </TableCell>
                      <TableCell sx={{ color: colors.color5, fontWeight: "bold" }}>
                        {t("userAppointments.hour")}
                      </TableCell>
                      <TableCell sx={{ color: colors.color5, fontWeight: "bold" }}>
                        {t("userAppointments.service")}
                      </TableCell>
                      <TableCell sx={{ color: colors.color5, fontWeight: "bold" }}>
                        {t("userAppointments.dentist")}
                      </TableCell>
                      <TableCell sx={{ color: colors.color5, fontWeight: "bold" }}>
                        {t("userAppointments.price")}
                      </TableCell>
                      <TableCell sx={{ color: colors.color5, fontWeight: "bold" }}>
                        {t("userAppointments.state")}
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {appointments.map((a) => {
                      const date = new Date(a.doctorBlock.timeStart);
                      const price = a.services.reduce(
                        (sum, s) => sum + (s.lowPrice || 0),
                        0
                      );

                      return (
                        <TableRow
                          key={a.id}
                          sx={{
                            "&:nth-of-type(odd)": {
                              backgroundColor: colors.color3 + "22",
                            },
                            "&:hover": {
                              backgroundColor: colors.color4 + "33",
                            },
                          }}
                        >
                          <TableCell sx={{ color: colors.white }}>
                            {date.toLocaleDateString()}
                          </TableCell>

                          <TableCell sx={{ color: colors.white }}>
                            {date.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </TableCell>

                          <TableCell sx={{ color: colors.white }}>
                            {a.services.map((s) => s.name).join(", ")}
                          </TableCell>

                          <TableCell sx={{ color: colors.white }}>
                            {a.doctorBlock.user.name} {a.doctorBlock.user.surname}
                          </TableCell>

                          <TableCell sx={{ color: colors.white }}>
                            {price} zł
                          </TableCell>

                          <TableCell
                            sx={{
                              color:
                                a.status === "Completed"
                                  ? "#8ef58a"
                                  : a.status === "Canceled"
                                    ? "#f58a8a"
                                    : "#fff68a",
                            }}
                          >
                            {t(`appointmentStatus.${a.status}`)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
}
