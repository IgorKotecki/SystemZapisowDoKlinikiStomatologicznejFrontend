import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button, Dialog, DialogActions, TextField, DialogTitle } from "@mui/material";
import UserNavigation from "../../components/userComponents/userNavigation";
import { useTranslation } from "react-i18next";
import { colors } from "../../utils/colors";
import get from "../../api/get";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { showAlert } from "../../utils/GlobalAlert";
import deleteApi from "../../api/delete";
import DeleteIcon from '@mui/icons-material/Delete';
import post from "../../api/post";

interface AdditionalInfo {
    id: number;
    body: string;
}

const AdditionalInformation: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);

    const fetchAddInfo = async () => {
        setLoading(true);
        var language = i18n.language;
        try {
            const response = await get.getAdditionalInformation(language);
            setAdditionalInfo(response);
        } catch (error) {
            console.error(error);
            showAlert({ type: "error", message: t("additionalInfo.errorLoadingData") });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddInfo();
    }, []);

    const handleDeleteClick = async (id: number) => {
        try {
            await deleteApi.deleteAdditionalInformation(id);
            showAlert({ type: "success", message: t("additionalInfo.deleteSuccess") });
            fetchAddInfo();
        } catch (error) {
            console.error(error);
            showAlert({ type: "error", message: t("additionalInfo.deleteError") });
        }
    };

    const columns: GridColDef<AdditionalInfo>[] = [
        // @ts-ignore
        { field: 'body', headerName: t("additionalInfo.body"), flex: 1 },
        {
            field: 'action',
            headerName: t("additionalInfo.action"),
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        sx={{ color: colors.white, backgroundColor: colors.redTooth, '&:hover': { backgroundColor: colors.calenderBorderDayOff } }}
                        size="small"
                        onClick={() => handleDeleteClick(params.row.id)}
                    >
                        <DeleteIcon />
                    </Button>
                </Box>
            ),
        },
    ];

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const newInfoPl = data.get('infoPl') as string;
        const newInfoEn = data.get('infoEn') as string;

        const addInfoPayload = {
            bodyPl: newInfoPl,
            bodyEn: newInfoEn,
            language: i18n.language,
        };

        await post.addAdditionalInformation(addInfoPayload).then((response) => {
            const newItem: AdditionalInfo = {
                id: response.id,
                body: response.body,
            };

            const currentAddInfo = additionalInfo || [];
            const newAddInfoArray = [...currentAddInfo, newItem];

            setAdditionalInfo(newAddInfoArray);
            setOpenModal(false);
            showAlert({
                type: 'success', message: t('addInfo.addInfoAdded')
            });
        })
            .catch((error) => {
                console.error('Error adding additional info:', error);
                showAlert({
                    type: 'error', message: t('addInfo.addInfoError')
                });
            }
            );
    }

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
                        {t("additionalInfo.title")}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1, opacity: 0.9 }}>
                            {t("additionalInfo.subtitle")}
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{ ml: 2, color: colors.white, backgroundColor: colors.color3, '&:hover': { backgroundColor: colors.color4 } }}
                            onClick={() => setOpenModal(true)}
                        >
                            {t("addInfo.addInfoButton")}
                        </Button>
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
                            rows={additionalInfo}
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
                <Dialog
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    PaperProps={{
                        sx: {
                            backgroundColor: colors.color2,
                            color: colors.white,
                            borderRadius: 3,
                            width: 300,
                            p: 4,
                        },
                    }}
                >
                    <DialogTitle>
                        <Typography component="h2" variant="h6" sx={{ color: colors.color5, mb: 2 }}>
                            {t("addInfo.addInfoTitle")}
                        </Typography>
                    </DialogTitle>
                    <form onSubmit={handleSubmit} id="addinfo-form">
                        <TextField
                            label={t("addInfo.newInfoLabelPl")}
                            variant="outlined"
                            fullWidth
                            name="infoPl"
                            key={'infoPl'}
                            sx={{ mb: 2, backgroundColor: colors.white }}
                        />
                        <TextField
                            label={t("addInfo.newInfoLabelEn")}
                            variant="outlined"
                            fullWidth
                            name="infoEn"
                            key={'infoEn'}
                            sx={{ mb: 2, backgroundColor: colors.white }}
                        />

                    </form>
                    <DialogActions sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => setOpenModal(false)}
                            sx={{ borderColor: colors.color3, color: colors.white }}
                        >
                            {t("doctorFreeDays.cancel")}
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                            form="addinfo-form"
                            sx={{ backgroundColor: colors.color3, color: colors.white }}
                        >
                            {t("addInfo.addInfoButton")}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default AdditionalInformation;