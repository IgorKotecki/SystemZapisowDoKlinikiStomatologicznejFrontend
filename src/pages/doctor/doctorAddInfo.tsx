import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Paper, Button, Dialog, DialogActions, TextField, DialogTitle, DialogContent } from "@mui/material";
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
    const [infoPl, setInfoPl] = useState('');
    const [infoEn, setInfoEn] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const isSubmitting = useRef(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [infoToDeleteId, setInfoToDeleteId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchAddInfo = async () => {
        setLoading(true);
        const language = i18n.language;
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
    }, [i18n.language]);

    const handleDeleteClick = async () => {
        if (!infoToDeleteId) return;
        setIsDeleting(true);
        try {
            await deleteApi.deleteAdditionalInformation(infoToDeleteId!);
            showAlert({ type: "success", message: t("additionalInfo.deleteSuccess") });
            fetchAddInfo();
        } catch (error) {
            console.error(error);
            showAlert({ type: "error", message: t("additionalInfo.deleteError") });
        } finally {
            setDeleteDialogOpen(false);
            setInfoToDeleteId(null);
            setIsDeleting(false);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setInfoPl('');
        setInfoEn('');
    };

    const submitAddInfo = async () => {
        if (isSubmitting.current) {
            console.log('Already submitting, blocked!');
            return;
        }

        isSubmitting.current = true;
        setSubmitting(true);

        const addInfoPayload = {
            bodyPl: infoPl,
            bodyEn: infoEn,
            language: i18n.language,
        };

        try {
            const response = await post.addAdditionalInformation(addInfoPayload);
            const newItem: AdditionalInfo = {
                id: response.id,
                body: response.body,
            };

            setAdditionalInfo([...additionalInfo, newItem]);
            handleCloseModal();
            showAlert({ type: 'success', message: t('addInfo.success') });
        } catch (error) {
            console.error('Error adding additional info:', error);
            showAlert({ type: 'error', message: t('addInfo.error') });
        } finally {
            setSubmitting(false);
            isSubmitting.current = false;
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
                        onClick={() => {
                            setInfoToDeleteId(params.row.id);
                            setDeleteDialogOpen(true);
                        }}
                    >
                        <DeleteIcon />
                    </Button>
                </Box>
            ),
        },
    ];

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
                            disabled={submitting}
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
                    onClose={handleCloseModal}
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

                    <TextField
                        label={t("addInfo.newInfoLabelPl")}
                        variant="outlined"
                        fullWidth
                        required
                        value={infoPl}
                        onChange={(e) => setInfoPl(e.target.value)}
                        sx={{ mb: 2, backgroundColor: colors.white }}
                    />
                    <TextField
                        label={t("addInfo.newInfoLabelEn")}
                        variant="outlined"
                        fullWidth
                        required
                        value={infoEn}
                        onChange={(e) => setInfoEn(e.target.value)}
                        sx={{ mb: 2, backgroundColor: colors.white }}
                    />

                    <DialogActions sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={handleCloseModal}
                            sx={{ borderColor: colors.color3, color: colors.white }}
                        >
                            {t("doctorFreeDays.cancel")}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={submitAddInfo}
                            disabled={submitting || !infoPl || !infoEn}
                            sx={{ backgroundColor: colors.color3, color: colors.white }}
                        >
                            {t("addInfo.addInfoButton")}
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                        open={deleteDialogOpen}
                        onClose={() => {
                            setDeleteDialogOpen(false)
                            setInfoToDeleteId(null);
                        }}
                        disableScrollLock
                        aria-labelledby="delete-dialog-title"
                      >
                        <DialogTitle id="delete-dialog-title">
                          {t("addInfo.confirmDeleteTitle")}
                        </DialogTitle>
                        <DialogContent>
                          <Typography>
                            {t("addInfo.confirmDeleteMessage")}
                          </Typography>
                        </DialogContent>
                        <DialogActions sx={{ p: 2, gap: 1 }}>
                          <Button
                            onClick={
                                () => {
                                    setDeleteDialogOpen(false);
                                    setInfoToDeleteId(null);
                                }
                            }
                            color="inherit"
                            sx={{ borderRadius: "20px", px: 3 }}
                          >
                            {t("cancel") || t("cancel")}
                          </Button>
                          <Button
                            onClick={handleDeleteClick}
                            disabled={isDeleting}
                            variant="contained"
                            color="error"
                            autoFocus
                            sx={{ borderRadius: "20px", px: 3 }}
                          >
                            {t("delete")}
                          </Button>
                        </DialogActions>
                      </Dialog>
            </Box>
        </Box>
    );
};

export default AdditionalInformation;