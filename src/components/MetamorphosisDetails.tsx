import React from "react";
import {
    Modal,
    Paper,
    Typography,
    Box,
    Button,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { colors } from "../utils/colors";
import ImageSlider from "./ImageSlider";

interface MetamorphosisDetailsModalProps {
    open: boolean;
    onClose: () => void;
    beforeImage: string;
    afterImage: string;
}

const MetamorphosisDetails: React.FC<MetamorphosisDetailsModalProps> = ({
    open,
    onClose,
    beforeImage,
    afterImage,
}) => {
    const { t } = useTranslation();

    return (
        <Modal open={open} onClose={onClose} disableScrollLock>
            <Paper
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { xs: "95%", md: 850 },
                    maxHeight: "90vh",
                    overflowY: "auto",
                    p: { xs: 2, md: 4 },
                    backgroundColor: colors.color2,
                    color: colors.white,
                    borderRadius: 3,
                    outline: "none",
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: colors.color5,
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <Typography
                    variant="h4"
                    sx={{ color: colors.color5, mb: 3, fontWeight: "bold", pr: 4 }}
                >
                    {t("metamorphosis.title")}
                </Typography>

                <Box sx={{ mb: 4, borderRadius: 2, overflow: "hidden" }}>
                    <ImageSlider beforeImage={beforeImage} afterImage={afterImage} />
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: colors.color5,
                            fontWeight: "bold",
                            borderBottom: `1px solid ${colors.color3}`,
                            mb: 2,
                            pb: 1,
                        }}
                    >
                        {t("metamorphosis.description")}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            lineHeight: 1.8,
                            opacity: 0.9,
                            textAlign: "justify",
                        }}
                    >
                        {t("metamorphosis.longDescription")}
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                    <Button
                        variant="contained"
                        onClick={onClose}
                        sx={{
                            backgroundColor: colors.color3,
                            color: colors.white,
                            fontWeight: "bold",
                            px: 4,
                            "&:hover": { backgroundColor: colors.color4 },
                        }}
                    >
                        {t("dentalChart.close")}
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
};

export default MetamorphosisDetails;