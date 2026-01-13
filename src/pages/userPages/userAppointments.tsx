import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import UserNavigation from "../../components/userComponents/userNavigation";
import { colors } from "../../utils/colors";
import type { Appointment } from "../../Interfaces/Appointment";
import get from "../../api/get";
import { showAlert } from "../../utils/GlobalAlert";
import LoadingScreen from "../../components/Loading";
import type { GridColDef } from "@mui/x-data-grid/models/colDef";
import { DataGrid } from "@mui/x-data-grid";
import type { Service } from "../../Interfaces/Service";
import { InfoOutline } from "@mui/icons-material";
import put from "../../api/put";
import AppointmentDetailsDialogContent from "../../components/AppointmentDetailsDialogContent";

export default function VisitsHistoryPage() {
  const { t, i18n } = useTranslation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellationDialogOpen, setCancellationDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedAppointmentCancel, setSelectedAppointmentCancel] = useState<Appointment | null>(null);
  const [selectedAppointmentDetail, setSelectedAppointmentDetail] = useState<Appointment | null>(null);
  const [showCancelled, setShowCancelled] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);

  const columns: GridColDef<Appointment>[] = [
    {
      field: 'startTime',
      headerName: t("userAppointments.date"),
      width: 100,
      valueFormatter: (params) => {
        const date = new Date(params);
        return date.toLocaleDateString();
      },
    },
    {
      field: 'timeRange',
      headerName: t("userAppointments.hour"),
      width: 110,
      valueGetter: (_, row) => {
        const start = new Date(row.startTime);
        const end = new Date(row.endTime);
        return `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      },
    },
    {
      field: 'services',
      headerName: t("userAppointments.services"),
      width: 250,
      // @ts-ignore
      flex: 1,
      // @ts-ignore
      valueFormatter: (params: Service) => params.map(s => s.name).join(", "),
    },
    {
      field: 'status',
      headerName: t("userAppointments.state"),
      width: 120,
      renderCell: (params) => {
        let color = colors.black;
        if (params.value === "Completed" || params.value === "Zakończona") {
          color = colors.greenTooth;
        } else if (params.value === "Cancelled" || params.value === "Anulowana") {
          color = colors.cancelled;
        }
        return (
          <Box
            sx={{
              justifyContent: 'left',
              alignItems: 'center',
              display: 'flex',
              width: '100%',
              height: '100%',
            }}
          >
            <Typography sx={{ color, fontSize: '14px' }}>{params.value}</Typography>
          </Box>
        );
      },
    },
    {
      field: 'action',
      headerName: t("receptionistUsers.action"),
      width: 300,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%', justifyContent: 'center' }}>
          <Button
            variant="contained"
            sx={{ color: colors.white, backgroundColor: colors.cancelled, '&:hover': { backgroundColor: colors.cancelledDark } }}
            size="small"
            onClick={() => handleCancelClick(params.row)}
          >
            {t("userAppointments.cancelAppointment")}
          </Button>
          <Button
            variant="contained"
            sx={{ color: colors.white, backgroundColor: colors.color3, '&:hover': { backgroundColor: colors.color4 } }}
            size="small"
            onClick={() => { setDetailDialogOpen(true); setSelectedAppointmentDetail(params.row) }}
          >
            <InfoOutline sx={{ height: '20px', marginRight: '5px' }} />
            {t("userAppointments.viewDetails")}
          </Button>
        </Box>
      ),
    },
  ];

  const handleCancelClick = (appointment: Appointment) => {
    if (appointment.status === "Cancelled" || appointment.status === "Anulowana") {
      showAlert({ type: "error", message: t("userAppointments.alreadyCancelled") });
      return;
    }
    if (appointment.status === "Completed" || appointment.status === "Zakończona") {
      showAlert({ type: "error", message: t("userAppointments.alreadyCompleted") });
      return;
    }
    setSelectedAppointmentCancel(appointment);
    setCancellationDialogOpen(true);
  }

  const fetchAppointments = async (showCancelled: boolean, showCompleted: boolean) => {
    try {
      setLoading(true);
      const lang = i18n.language || "pl";
      const response = await get.getUserAppointments(lang, showCancelled, showCompleted, true);
      setAppointments(response);
    } catch (err) {
      showAlert({ type: "error", message: t("userAppointments.fetchError") });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(showCancelled, showCompleted);
  }, [i18n.language]);

  const cancellAppointment = async () => {
    if (!selectedAppointmentCancel) return;
    try {
      setCancelling(true);

      await put.cancellation(
        {
          appointmentGuid: selectedAppointmentCancel.appointmentGroupId,
          reason: "",
        }
      );
      showAlert({ type: "success", message: t("userAppointments.cancelSuccess") });
      setCancellationDialogOpen(false);
      setSelectedAppointmentCancel(null);
      fetchAppointments(showCancelled, showCompleted);
    } catch (err) {
      console.error(err);
      showAlert({ type: "error", message: t("userAppointments.cancelError") });
    } finally {
      setCancelling(false);
    }
  };


  if (loading) return <LoadingScreen />;

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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {t("userAppointments.pageInfo")}
            </Typography>
            <Box>
              <FormControlLabel
                control={<Switch checked={showCancelled} onChange={async (e) => {
                  var newValue = e.target.checked;
                  setShowCancelled(newValue);
                  await fetchAppointments(newValue, showCompleted);
                }} />}
                label={t("receptionistCalendar.showCancelled")}
                sx={{ color: colors.white }}
              />
              <FormControlLabel
                control={<Switch checked={showCompleted} onChange={async (e) => {
                  var newValue = e.target.checked;
                  setShowCompleted(newValue);
                  await fetchAppointments(showCancelled, newValue);
                }} />}
                label={t("receptionistCalendar.showCompleted")}
                sx={{ color: colors.white }}
              />
            </Box>
          </Box>
          <Paper
            elevation={6}
            sx={{
              backgroundColor: colors.pureWhite,
              borderRadius: 3,
              overflow: 'hidden',
              padding: 1,
            }}
          >
            <DataGrid
              rows={appointments}
              columns={columns}
              loading={loading}
              autoHeight
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              pageSizeOptions={[5, 10, 20, 50]}
              disableRowSelectionOnClick
              disableAutosize
              disableColumnResize
              disableColumnMenu
              showToolbar={true}
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell:focus': { outline: 'none' },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f5f5f5',
                  color: colors.color1,
                  fontWeight: 'bold',
                },
              }}
              getRowId={(row) => row.appointmentGroupId}
            />
          </Paper>
          <Dialog
            open={cancellationDialogOpen}
            PaperProps={{
              sx: {
                backgroundColor: colors.color2,
                color: colors.white,
                borderRadius: 3,
                p: 2,
                minWidth: { xs: "90%", sm: 400 }
              }
            }}
          >
            <DialogTitle>
              <Typography variant="h5" sx={{ color: colors.white, fontWeight: "bold" }}>
                {t("userAppointments.cancelAppointment")}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Typography sx={{ mb: 2, opacity: 0.8 }}>
                {t("userAppointments.cancelSubtitle")}
              </Typography>
              <Typography sx={{ mb: 2, fontWeight: "bold" }}>
                {selectedAppointmentCancel?.startTime && new Date(selectedAppointmentCancel.startTime).toLocaleString()}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
              <Button
                onClick={() => {
                  setCancellationDialogOpen(false);
                }}
                sx={{ color: colors.white, textTransform: "none" }}
              >
                {t("global.cancel")}
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: colors.color3,
                  color: colors.white,
                  textTransform: "none",
                  px: 4,
                  "&:hover": { backgroundColor: colors.color4 }
                }}
                onClick={cancellAppointment}
              >
                {cancelling ? <CircularProgress size={24} color="inherit" /> : t("global.confirm")}
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={detailDialogOpen}
            PaperProps={{
              sx: {
                backgroundColor: colors.color2,
                color: colors.white,
                borderRadius: 3,
                p: 2,
                minWidth: 800,
              }
            }}
          >
            <DialogTitle>
              <Typography variant="h5" sx={{ color: colors.white, fontWeight: "bold" }}>
                {t("userAppointments.viewDetails")}
              </Typography>
            </DialogTitle>
            <AppointmentDetailsDialogContent
              selectedAppointmentDetail={selectedAppointmentDetail} />
            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
              <Button
                onClick={() => {
                  setDetailDialogOpen(false);
                }}
                sx={{ color: colors.white, textTransform: "none" }}
              >
                {t("close")}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box >
  );
}
