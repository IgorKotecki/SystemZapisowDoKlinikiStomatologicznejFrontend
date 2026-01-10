import { useEffect, useState } from "react";
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
  Tooltip,
  IconButton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import UserNavigation from "../../components/userComponents/userNavigation";
import { colors } from "../../utils/colors";
import type { Appointment } from "../../Interfaces/Appointment";
import get from "../../api/get";
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

export default function VisitsHistoryPage() {

  const { t, i18n } = useTranslation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const lang = i18n.language || "pl";
        const response = await get.getUserAppointments(lang);
        setAppointments(response);
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
                      <TableCell sx={{ color: colors.color5, fontWeight: "bold" }}>
                        {t("userAppointments.additionalInformation")}
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {appointments.map((a) => {
                      console.log(a.additionalInformation)
                      const date = new Date(a.startTime);
                      const price = a.services.reduce(
                        (sum, s) => sum + (s.highPrice || 0),
                        0
                      );

                      return (
                        <TableRow
                          key={a.appointmentGroupId}
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
                            {a.doctor.name} {a.doctor.surname}
                          </TableCell>

                          <TableCell sx={{ color: colors.white }}>
                            {price} zł
                          </TableCell>

                          <TableCell
                            sx={{
                              color:
                                (a.status === "Completed" || a.status === "Zakończona")
                                  ? "#8ef58a"
                                  : (a.status === "Canceled" || a.status === "Anulowana")
                                    ? "#f58a8a"
                                    : "#fff68a",
                            }}
                          >
                            {a.status}
                          </TableCell>

                          <TableCell sx={{ textAlign: 'center' }}>
                            {a.additionalInformation && a.additionalInformation.length > 0 ? (
                              <Tooltip
                                title={"- " + a.additionalInformation.map((i) => i.body).join("\n - ")}
                                slotProps={{
                                  tooltip: {
                                    sx: {
                                      whiteSpace: "pre-line", 
                                      padding: "10px",
                                      fontSize: 15
                                    }

                                  }
                                }}
                                arrow
                              >
                                <IconButton size="small" sx={{ color: colors.color5 }}>
                                  <InfoOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Typography variant="body2" sx={{color: colors.white, opacity: 0.5, fontSize: "italic" }}>
                                {t("userAppointments.noInformation")}
                              </Typography>
                            )} 
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
