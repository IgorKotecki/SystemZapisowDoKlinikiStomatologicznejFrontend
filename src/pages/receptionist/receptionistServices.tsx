import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, Paper, Button, CircularProgress } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import UserNavigation from "../../components/userComponents/userNavigation";
import AddServiceModal from "../../components/AddService";
import EditServiceModal from "../../components/EditServiceModel";
import { useTranslation } from "react-i18next";
import { colors } from "../../utils/colors";
import type { Service } from "../../Interfaces/Service";
import type { ServiceCategory } from "../../Interfaces/ServiceCategory";
import get from "../../api/get";
import { DataGrid, type GridColDef, GridToolbar } from '@mui/x-data-grid';

const ReceptionistServices: React.FC = () => {
  const { t, i18n } = useTranslation();

  const [groupedServices, setGroupedServices] = useState<Record<string, Service[]>>({});
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);

  const services = useMemo(() => Object.values(groupedServices).flat(), [groupedServices]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const lang = i18n.language || 'pl';
      const [servicesData, categoriesData] = await Promise.all([
        get.getAllServices(lang),
        get.getServiceCategories()
      ]);
      setGroupedServices(servicesData.servicesByCategory);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [i18n.language]);

  const handleEditClick = (id: number) => {
    setSelectedServiceId(id);
    setOpenEditModal(true);
  };

  const columns: GridColDef<Service>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: t("receptionistServices.name"), flex: 1 },
    {
      field: 'price',
      headerName: t("receptionistServices.price"),
      width: 200,
      renderCell: (params) => {
        const { lowPrice, highPrice } = params.row;
        if (lowPrice && highPrice) {
          return `${lowPrice} - ${highPrice} zł`;
        }
        if (lowPrice) {
          return `${lowPrice} zł`;
        }
        if (highPrice) {
          return `${highPrice} zł`;
        }
        return "—";
      }
    },
    {
      field: 'action',
      headerName: t("receptionistUsers.action"),
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          sx={{ color: colors.color1, borderColor: colors.color1 }}
          onClick={() => handleEditClick(params.row.id)}
        >
          {t("receptionistUsers.viewEdit")}
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, width: "100%", minHeight: "100vh", backgroundColor: colors.color1 }}>
      <UserNavigation />

      <Box component="main" sx={{ flex: 1, px: { xs: 2, md: 8 }, py: 6, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box sx={{ width: "100%", maxWidth: 1500 }}>
          <Typography variant="h4" gutterBottom sx={{ color: colors.color5, fontWeight: "bold" }}>
            {t("receptionistServices.title")}
          </Typography>

          <Button
            variant="contained"
            fullWidth
            startIcon={<AddIcon />}
            onClick={() => setOpenAddModal(true)}
            sx={{ backgroundColor: colors.color5, color: colors.color1, fontWeight: "bold", mb: 3, py: 1.5, "&:hover": { backgroundColor: colors.color4 } }}
          >
            {t("receptionistServices.addNew")}
          </Button>

          <Paper elevation={6} sx={{ backgroundColor: colors.white, borderRadius: 3, p: 2 }}>
            <DataGrid
              rows={services}
              columns={columns}
              loading={loading}
              showToolbar={true}
              autoHeight
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              sx={{ border: 'none', '& .MuiDataGrid-cell:focus': { outline: 'none' } }}
            />
            {/* <DataGrid
              rows={services}
              columns={columns}
              loading={loading}
              autoHeight
              slots={{
                toolbar: GridToolbar,
              }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell:focus': { outline: 'none' },
                '& .MuiButton-root': { color: colors.color1 }
              }}
            /> */}
          </Paper>
        </Box>
      </Box>

      <AddServiceModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        categories={categories}
        onSuccess={fetchInitialData}
      />

      <EditServiceModal
        open={openEditModal}
        serviceId={selectedServiceId}
        onClose={() => setOpenEditModal(false)}
        onSuccess={fetchInitialData}
        categories={categories}
      />
    </Box>
  );
};

export default ReceptionistServices;