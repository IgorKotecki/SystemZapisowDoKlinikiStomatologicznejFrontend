import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import UserNavigation from "../../components/userComponents/userNavigation";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { colors } from "../../utils/colors";
import type { User } from "../../Interfaces/User";
import { useAuth } from "../../context/AuthContext";
import get from "../../api/get";
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import EditUserModal from "../../components/EditUserModel";
import { showAlert } from "../../utils/GlobalAlert";

const ReceptionistUsers: React.FC = () => {
  const { userRole } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  
  // Pagination state
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      // Reset to first page when search changes
      setPaginationModel(prev => ({ ...prev, page: 0 }));
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await get.getAllUsers(
        paginationModel.page, 
        paginationModel.pageSize,
        debouncedSearchTerm
      );
      setUsers(response.users);
      setTotalRows(response.totalCount);
    } catch (error) {
      console.error("Error fetching users:", error);
      showAlert({
        type: "error",
        message: t("receptionistUsers.fetchError")
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [paginationModel.page, paginationModel.pageSize, debouncedSearchTerm]);

  const columns: GridColDef<User>[] = [
    { field: 'name', headerName: t("receptionistUsers.firstName"), width: 150 },
    { field: 'surname', headerName: t("receptionistUsers.lastName"), width: 150 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'phoneNumber', headerName: t("receptionistUsers.phone"), width: 180 },
    {
      field: 'action',
      headerName: t("receptionistUsers.action"),
      width: 350,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%', justifyContent: 'center' }}>
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
    setSelectedUserId(userId);
    setIsEditModalOpen(true);
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
          <Typography variant="subtitle1" sx={{ mb: 2, opacity: 0.9 }}>
            {t("receptionistUsers.subtitle")}
          </Typography>

          {/* Search Box */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={t("receptionistUsers.searchPlaceholder") || "Search by name, email, or phone..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: colors.color3 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: colors.pureWhite,
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: colors.color3,
                  },
                  '&:hover fieldset': {
                    borderColor: colors.color4,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.color3,
                  },
                },
              }}
            />
          </Box>

          <Paper
            elevation={6}
            sx={{
              backgroundColor: colors.pureWhite,
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
              
              paginationMode="server"
              rowCount={totalRows}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              
              pageSizeOptions={[5, 10, 20, 50]}
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