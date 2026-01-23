import React, { useState, useEffect } from "react";
import {
    Modal, Paper, Typography, Grid, TextField, Box, Button,
    CircularProgress, MenuItem, Select, FormControl, InputLabel,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@mui/material";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { colors } from "../utils/colors";
import type { ServiceCategory } from "../Interfaces/ServiceCategory";
import type { ServiceEdit } from "../Interfaces/ServiceEdit";
import get from "../api/get";
import put from "../api/put";
import serviceDelete from "../api/delete";
import { showAlert } from "../utils/GlobalAlert";

interface EditServiceModalProps {
    open: boolean;
    onClose: () => void;
    serviceId: number | null;
    onSuccess: () => void;
    categories: ServiceCategory[];
}

const EditServiceModal: React.FC<EditServiceModalProps> = ({ open, onClose, serviceId, onSuccess, categories }) => {
    const { t, i18n } = useTranslation();
    const [serviceData, setServiceData] = useState<ServiceEdit | null>(null);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        if (open && serviceId) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const res = await get.getServiceById(serviceId);
                    setServiceData(res);
                } catch (e) {
                    showAlert({ type: "error", message: t("editService.fetchError") });
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [open, serviceId, t]);

    const validate = (): boolean => {
        if (!serviceData?.namePl?.trim() || !serviceData?.nameEn?.trim()) {
            showAlert({ type: "error", message: t("receptionistServices.errorEmptyFields") });
            return false;
        }
        // if ( (Number(serviceData.lowPrice) < 1 && Number(serviceData.lowPrice) > Number(serviceData.highPrice)) || Number(serviceData.highPrice) < 1) {
        //     showAlert({ type: "error", message: t("receptionistServices.errorPrices") });
        //     return false;
        // }
        const low = Number(serviceData.lowPrice);
        const high = Number(serviceData.highPrice);

        const hasValidLow = low > 1;
        const hasValidHigh = high > 1;
        const isRangeInvalid = hasValidLow && hasValidHigh && low > high;

        if (!hasValidLow && !hasValidHigh) {
            showAlert({ type: "error", message: t("receptionistServices.errorPricesMissing") });
            return false;
        }

        if (isRangeInvalid) {
            showAlert({ type: "error", message: t("receptionistServices.errorPriceRange") });
            return false;
        }

        return true;
    };

    const handleSave = async () => {
        if (!serviceData || !serviceId || !validate()) return;
        setIsSubmitting(true);
        try {
            await put.updateService(serviceData, serviceId);
            showAlert({ type: "success", message: t("editService.saveSuccess") });
            onSuccess();
            onClose();
        } catch (e) {
            showAlert({ type: "error", message: t("editService.saveError") });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!serviceId) return;
        try {
            await serviceDelete.deleteService(serviceId);
            showAlert({ type: "success", message: t("editService.deleteSuccess") });
            onSuccess();
            onClose();
        } catch (e) {
            showAlert({ type: "error", message: t("editService.deleteError") });
        } finally {
            setIsDeleteDialogOpen(false);
        }
    };

    const textFieldStyle = {
        backgroundColor: colors.white, borderRadius: 1,
        "& .MuiInputBase-input": { color: colors.color1 },
        "& .MuiInputLabel-root": { color: colors.color2 },
    };

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Paper sx={{
                    position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                    width: { xs: "95%", md: 700 }, maxHeight: "90vh", overflowY: "auto",
                    p: 4, backgroundColor: colors.color2, color: colors.white, borderRadius: 3,
                }}>
                    <Typography variant="h5" sx={{ color: colors.color5, mb: 4, fontWeight: 'bold' }}>
                        {t("editService.title")}
                    </Typography>

                    {loading ? <CircularProgress color="inherit" /> :
                        serviceData && (
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        label={t("editService.namePl")}
                                        sx={textFieldStyle}
                                        value={serviceData.namePl}
                                        onChange={(e) => setServiceData({ ...serviceData, namePl: e.target.value })}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        label={t("editService.nameEn")}
                                        sx={textFieldStyle}
                                        value={serviceData.nameEn}
                                        onChange={(e) => setServiceData({ ...serviceData, nameEn: e.target.value })}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label={t("editService.lowPrice")}
                                        sx={textFieldStyle}
                                        value={serviceData.lowPrice}
                                        onChange={(e) => setServiceData({ ...serviceData, lowPrice: Number(e.target.value) })}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label={t("editService.highPrice")}
                                        sx={textFieldStyle}
                                        value={serviceData.highPrice}
                                        onChange={(e) => setServiceData({ ...serviceData, highPrice: Number(e.target.value) })}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label={t("editService.minTime")}
                                        sx={textFieldStyle}
                                        value={serviceData.minTime}
                                        onChange={(e) => setServiceData({ ...serviceData, minTime: Number(e.target.value) })}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <FormControl fullWidth sx={{ backgroundColor: colors.white, borderRadius: 1 }}>
                                        <InputLabel>{t("editService.category")}</InputLabel>
                                        <Select
                                            label={t("editService.category")}
                                            value={serviceData.serviceCategoryIds[0] || ""}
                                            onChange={(e) =>
                                                setServiceData({ ...serviceData, serviceCategoryIds: [Number(e.target.value)] })
                                            }
                                        >
                                            {categories.map((c) => (
                                                <MenuItem key={c.id} value={c.id}>
                                                    {i18n.language === "pl" ? c.namePl : c.nameEn}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                                        <Button variant="outlined" color="error" startIcon={<Trash2 />} onClick={() => setIsDeleteDialogOpen(true)}
                                            sx={{ borderColor: "#ff4444", color: "#ff4444" }}>
                                            {t("editService.delete")}
                                        </Button>
                                        <Box sx={{ display: "flex", gap: 2 }}>
                                            <Button onClick={onClose} sx={{ color: colors.white }}>{t("userProfile.cancel")}</Button>
                                            <Button variant="contained" onClick={handleSave} disabled={isSubmitting}
                                                sx={{ backgroundColor: colors.color5, color: colors.color1, fontWeight: 'bold' }}>
                                                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : t("userProfile.save")}
                                            </Button>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        )}
                </Paper>
            </Modal>

            <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}
                PaperProps={{ sx: { backgroundColor: colors.color2, color: colors.white, borderRadius: 3 } }}>
                <DialogTitle sx={{ color: colors.color5 }}>{t("editService.deleteService")}</DialogTitle>
                <DialogContent><DialogContentText sx={{ color: colors.white }}>{t("editService.deleteConfirmText")}</DialogContentText></DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setIsDeleteDialogOpen(false)} sx={{ color: colors.white }}>{t("editService.cancel")}</Button>
                    <Button onClick={handleDelete} variant="contained" sx={{ backgroundColor: "#ff4444" }}>{t("editService.delete")}</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EditServiceModal;