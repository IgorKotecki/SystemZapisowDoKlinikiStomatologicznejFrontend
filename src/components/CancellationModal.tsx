import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { colors } from "../utils/colors";
import put from "../api/put";
import { showAlert } from "../utils/GlobalAlert";

interface CancellationModalProps {
    open: boolean;
    onClose: () => void;
    appointmentGuid: string | null;
    onSuccess: () => void;
}

const CancellationModal: React.FC<CancellationModalProps> = ({
    open,
    onClose,
    appointmentGuid,
    onSuccess,
}) => {
    const { t } = useTranslation();
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!appointmentGuid) return;
        if (!reason.trim()) {
            showAlert({ type: "error", message: t("cancellation.errorEmptyReason") });
            return;
        }

        setLoading(true);
        try {
            await put.cancellation({
                appointmentGuid: appointmentGuid,
                reason: reason,
            });

            showAlert({ type: "success", message: t("cancellation.success") });
            setReason("");
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            let errorCode = err.response?.data?.title ??
                err.response?.data?.Title ?? // PascalCase
                "GENERIC_ERROR";
            showAlert({
                type: 'error',
                message: t(errorCode),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
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
                <Typography variant="h5" sx={{ color: colors.color5, fontWeight: "bold" }}>
                    {t("cancellation.title")}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Typography sx={{ mb: 2, opacity: 0.8 }}>
                    {t("cancellation.subtitle")}
                </Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder={t("cancellation.reasonPlaceholder")}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    sx={{
                        backgroundColor: colors.white,
                        borderRadius: 1,
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: colors.color3 },
                            "&:hover fieldset": { borderColor: colors.color4 },
                        }
                    }}
                />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                <Button
                    onClick={onClose}
                    sx={{ color: colors.white, textTransform: "none" }}
                >
                    {t("global.cancel")}
                </Button>
                <Button
                    variant="contained"
                    onClick={handleConfirm}
                    disabled={loading || !reason.trim()}
                    sx={{
                        backgroundColor: colors.color3,
                        color: colors.white,
                        fontWeight: "bold",
                        textTransform: "none",
                        px: 4,
                        "&:hover": { backgroundColor: colors.color4 }
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : t("global.confirm")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CancellationModal;