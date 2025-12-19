import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
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

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await get.getAllUsers();
        setUsers(response);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const columns: GridColDef<(typeof users)[number]>[] = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    {
      field: 'name',
      headerName: 'First name',
      editable: true,
      flex: 1,
    },
    {
      field: 'surname',
      headerName: 'Last name',
      editable: true,
      flex: 1,
    },
    {
      field: 'email',
      headerName: 'Email',
      editable: true,
      flex: 1,
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone number',
      editable: true,
      flex: 1,
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 2,
      sortable: false,
      editable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <Button variant="contained" sx={{color: colors.white, backgroundColor:colors.color3}} size="small" onClick={() => handleMakeAppointment(params.row as User)}>
            {t("receptionistUsers.makeAppointment")}
          </Button>
          <Button variant="outlined" sx={{color:colors.color1, borderColor: colors.color1}} size="small" onClick={() => handleUserClick(params.row.id)}>
            {t("receptionistUsers.viewEdit")}
          </Button>
        </Box>
      ),
    },
  ];

  const handleUserClick = (userId: number) => {
    const role = userRole;
    if (role == "Doctor") {
      navigate(`/doctor/users/${userId}`);
    } else if (role == "Receptionist") {
      navigate(`/receptionist/users/${userId}`);
    }
  };
  const handleMakeAppointment = (user : User) => {
    navigate(`/receptionist/appointment`, { state: { user: user } });
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
          <Typography variant="h4" gutterBottom sx={{ color: colors.color5 }}>
            {t("receptionistUsers.title")}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 3 }}>
            {t("receptionistUsers.subtitle")}
          </Typography>

          <DataGrid
            rows={users}
            columns={columns}
            loading={loading}
            sx={{
              width: '100%',
              flex: 0,
              height: '480px',
              backgroundColor: colors.white,
              color: colors.black,
            }}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 7,
                },
              },
            }}
            pageSizeOptions={[7]}
            disableRowSelectionOnClick
            disableColumnResize
          />

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

              </Box>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ReceptionistUsers;
