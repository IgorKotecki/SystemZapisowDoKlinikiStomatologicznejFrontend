import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
} from "@mui/material";
import UserNavigation from "../../components/userComponents/userNavigation";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { colors } from "../../utils/colors";
import type { User } from "../../Interfaces/User";
import { useAuth } from "../../context/AuthContext";
import get from "../../api/get";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';

const ReceptionistUsers: React.FC = () => {
  const { userRole } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await get.getAllUsers();
        setUsers(response);
      } catch (error) {
        console.error("Error fetching users:", error);
        setAlert({
          type: "error",
          message: t("receptionistUsers.fetchError") || "Błąd podczas pobierania użytkowników"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [t]);

  const columns: GridColDef<User>[] = [
    {
      field: 'name',
      headerName: t("receptionistUsers.firstName") || 'First name',
      width: 150,
    },
    {
      field: 'surname',
      headerName: t("receptionistUsers.lastName") || 'Last name',
      width: 150,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
    },
    {
      field: 'phoneNumber',
      headerName: t("receptionistUsers.phone") || 'Phone number',
      width: 150,
    },
    {
      field: 'action',
      headerName: t("receptionistUsers.action") || 'Action',
      width: 400,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <Button
            variant="contained"
            sx={{ color: colors.white, backgroundColor: colors.color3, '&:hover': { backgroundColor: colors.color4 } }}
            size="small"
            onClick={() => handleMakeAppointment(params.row)}
          >
            {t("receptionistUsers.makeAppointment")}
          </Button>
          <Button
            variant="outlined"
            sx={{ color: colors.color1, borderColor: colors.color1, '&:hover': { borderColor: colors.color3 } }}
            size="small"
            onClick={() => handleUserClick(params.row.id)}
          >
            {t("receptionistUsers.viewEdit")}
          </Button>
        </Box>
      ),
    },
  ];

  const handleUserClick = (userId: number) => {
    const role = userRole;
    if (role === "Doctor") {
      navigate(`/doctor/users/${userId}`);
    } else if (role === "Receptionist") {
      navigate(`/receptionist/users/${userId}`);
    }
  };

  const handleMakeAppointment = (user: User) => {
    navigate(`/receptionist/appointment`, { state: { user: user } });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, width: "100%", minHeight: "100vh", backgroundColor: colors.color1 }}>
      <UserNavigation />

      <Box
        component="main"
        sx={{
          flex: 1,
          px: { xs: 2, md: 8 },
          py: 4,
          color: colors.white,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 1500 }}>
          <Typography variant="h4" gutterBottom sx={{ color: colors.color5 }}>
            {t("receptionistUsers.title")}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 1, opacity: 0.9 }}>
            {t("receptionistUsers.subtitle")}
          </Typography>

          <Paper
            elevation={6}
            sx={{
              backgroundColor: colors.white,
              borderRadius: 3,
              overflow: 'hidden',
              p: 2
            }}
          >
            <DataGrid
              rows={users}
              columns={columns}
              loading={loading}
              autoHeight
              disableColumnResize
              showToolbar={true}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell:focus': { outline: 'none' },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f5f5f5',
                  color: colors.color1,
                  fontWeight: 'bold',
                },
              }}
            />
          </Paper>
        </Box>
      </Box>

      {alert && (
        <Alert
          severity={alert.type}
          variant="filled"
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 2000,
            minWidth: 300,
            boxShadow: "0px 4px 12px rgba(0,0,0,0.3)"
          }}
        >
          {alert.message}
        </Alert>
      )}
    </Box>
  );
};

export default ReceptionistUsers;