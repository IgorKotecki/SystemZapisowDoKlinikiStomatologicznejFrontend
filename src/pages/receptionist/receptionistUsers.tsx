import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button, Alert } from "@mui/material";
import UserNavigation from "../../components/userComponents/userNavigation";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { colors } from "../../utils/colors";
import type { User } from "../../Interfaces/User";
import get from "../../api/get";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import EditUserModal from "../../components/EditUserModel";

const ReceptionistUsers: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Stany dla modalu edycji
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (id: number) => {
    setSelectedUserId(id);
    setIsEditModalOpen(true);
  };

  const columns: GridColDef<User>[] = [
    { field: 'name', headerName: t("receptionistUsers.firstName"), width: 150 },
    { field: 'surname', headerName: t("receptionistUsers.lastName"), width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phoneNumber', headerName: t("receptionistUsers.phone"), width: 150 },
    {
      field: 'action',
      headerName: t("receptionistUsers.action"),
      width: 400,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
          <Button
            variant="contained"
            sx={{ color: colors.white, backgroundColor: colors.color3, '&:hover': { backgroundColor: colors.color4 } }}
            size="small"
            onClick={() => navigate(`/receptionist/appointment`, { state: { user: params.row } })}
          >
            {t("receptionistUsers.makeAppointment")}
          </Button>
          <Button
            variant="outlined"
            sx={{ color: colors.color1, borderColor: colors.color1 }}
            size="small"
            onClick={() => handleEditClick(params.row.id)}
          >
            {t("receptionistUsers.viewEdit")}
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, width: "100%", minHeight: "100vh", backgroundColor: colors.color1 }}>
      <UserNavigation />
      <Box component="main" sx={{ flex: 1, px: { xs: 2, md: 8 }, py: 6, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box sx={{ width: "100%", maxWidth: 1500 }}>
          <Typography variant="h4" gutterBottom sx={{ color: colors.color5, fontWeight: "bold" }}>
            {t("receptionistUsers.title")}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4, color: colors.white, opacity: 0.9 }}>
            {t("receptionistUsers.subtitle")}
          </Typography>

          <Paper elevation={6} sx={{ backgroundColor: colors.white, borderRadius: 3, p: 2 }}>
            <DataGrid
              rows={users}
              columns={columns}
              loading={loading}
              autoHeight
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              sx={{ border: 'none', '& .MuiDataGrid-cell:focus': { outline: 'none' } }}
            />
          </Paper>
        </Box>
      </Box>

      <EditUserModal 
        open={isEditModalOpen} 
        userId={selectedUserId} 
        onClose={() => setIsEditModalOpen(false)} 
        onSuccess={fetchUsers} 
      />
    </Box>
  );
};

export default ReceptionistUsers;