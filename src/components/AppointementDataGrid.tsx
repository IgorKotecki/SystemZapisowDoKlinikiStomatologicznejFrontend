// components/AppointmentsDataGrid.tsx
import { useState } from "react";
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid/models/colDef";
import { InfoOutline } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import type { Appointment } from "../Interfaces/Appointment";
import { colors } from "../utils/colors";
import type { Service } from "../Interfaces/Service";
import AppointmentDetailsDialogContent from "./AppointmentDetailsDialogContent";
// import CancellationModal from "./CancellationModal";
// import { storage } from "../utils/storage";


interface AppointmentsDataGridProps {
  appointments: Appointment[];
  loading: boolean;
  onCancelAppointment: (appointment: Appointment) => Promise<void>;
}

export default function AppointmentsDataGrid({
  appointments,
  loading,
  onCancelAppointment,
}: AppointmentsDataGridProps) {
  const { t } = useTranslation();
  const [cancellationDialogOpen, setCancellationDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedAppointmentCancel, setSelectedAppointmentCancel] = useState<Appointment | null>(null);
  const [selectedAppointmentDetail, setSelectedAppointmentDetail] = useState<Appointment | null>(null);
  const [cancelling, setCancelling] = useState(false);

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
      valueFormatter: (params: Service[]) => params.map(s => s.name).join(", "),
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
            disabled={params.row.status === "Cancelled" || params.row.status === "Anulowana" || params.row.status === "Completed" || params.row.status === "Zakończona"}
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
    setSelectedAppointmentCancel(appointment);
    setCancellationDialogOpen(true);
  };

  const handleConfirmCancellation = async () => {
    if (!selectedAppointmentCancel) return;

    try {
      setCancelling(true);
      await onCancelAppointment(selectedAppointmentCancel);
      setCancellationDialogOpen(false);
      setSelectedAppointmentCancel(null);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
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
          disableColumnMenu
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

      {/* Dialog anulowania */}
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
            onClick={() => setCancellationDialogOpen(false)}
            sx={{ color: colors.white, textTransform: "none" }}
            disabled={cancelling}
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
            onClick={handleConfirmCancellation}
            disabled={cancelling}
          >
            {cancelling ? <CircularProgress size={24} color="inherit" /> : t("global.confirm")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog szczegółów */}
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
          selectedAppointmentDetail={selectedAppointmentDetail}
        />
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setDetailDialogOpen(false)}
            sx={{ color: colors.white, textTransform: "none" }}
          >
            {t("close")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}