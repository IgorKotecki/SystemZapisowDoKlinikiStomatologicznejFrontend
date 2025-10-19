import React from "react";
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
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import UserNavigation from "../../components/userComponents/userNavigation";

const colors = {
  color1: "#003141",
  color2: "#004f5f",
  color3: "#007987",
  color4: "#00b2b9",
  color5: "#00faf1",
  white: "#ffffff",
};

interface Visit {
  date: string;
  time: string;
  treatment: string;
  dentist: string;
  price: string;
  status: string;
}

const visitsData: Visit[] = [
  {
    date: "2025-09-12",
    time: "10:30",
    treatment: "Scaling (Usuwanie kamienia nazębnego)",
    dentist: "dr Anna Nowak",
    price: "250 zł",
    status: "Zrealizowana",
  },
  {
    date: "2025-08-02",
    time: "15:00",
    treatment: "Wypełnienie kompozytowe",
    dentist: "dr Jan Kowalski",
    price: "320 zł",
    status: "Zrealizowana",
  },
  {
    date: "2025-10-25",
    time: "12:00",
    treatment: "Konsultacja kontrolna",
    dentist: "dr Monika Wiśniewska",
    price: "150 zł",
    status: "Zaplanowana",
  },
];

export default function VisitsHistoryPage() {
   const { t } = useTranslation();

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
            {t('userAppointments.title')}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            {t('userAppointments.pageInfo')}
          </Typography>

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
                    <TableCell sx={{ color: colors.color5, fontWeight: "bold" }}>{t('userAppointments.date')}</TableCell>
                    <TableCell sx={{ color: colors.color5, fontWeight: "bold" }}>{t('userAppointments.hour')}</TableCell>
                    <TableCell sx={{ color: colors.color5, fontWeight: "bold" }}>{t('userAppointments.service')}</TableCell>
                    <TableCell sx={{ color: colors.color5, fontWeight: "bold" }}>{t('userAppointments.dentist')}</TableCell>
                    <TableCell sx={{ color: colors.color5, fontWeight: "bold" }}>{t('userAppointments.price')}</TableCell>
                    <TableCell sx={{ color: colors.color5, fontWeight: "bold" }}>{t('userAppointments.state')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visitsData.map((visit, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:nth-of-type(odd)": { backgroundColor: colors.color3 + "22" },
                        "&:hover": { backgroundColor: colors.color4 + "33" },
                      }}
                    >
                      <TableCell sx={{ color: colors.white }}>{visit.date}</TableCell>
                      <TableCell sx={{ color: colors.white }}>{visit.time}</TableCell>
                      <TableCell sx={{ color: colors.white }}>{visit.treatment}</TableCell>
                      <TableCell sx={{ color: colors.white }}>{visit.dentist}</TableCell>
                      <TableCell sx={{ color: colors.white }}>{visit.price}</TableCell>
                      <TableCell
                        sx={{
                          color:
                            visit.status === "Zrealizowana"
                              ? "#8ef58a"
                              : visit.status === "Anulowana"
                              ? "#f58a8a"
                              : "#fff68a",
                        }}
                      >
                        {visit.status}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
