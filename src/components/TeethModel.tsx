import {
    Box,
    Typography,
    Paper,
    Tooltip,
    Grid,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import type { ToothData } from "../Interfaces/ToothData"


const colors = {
    color1: "#003141",
    color2: "#004f5f",
    color3: "#007987",
    color4: "#00b2b9",
    color5: "#00faf1",
    white: "#ffffff",
};

type TeethModelProps = {
    teeth: ToothData[];
    selectedTooth?: ToothData | null;
    setSelectedTooth?: (tooth: ToothData) => void;
};

export default function ToothDiagram({ teeth, setSelectedTooth, selectedTooth }: TeethModelProps) {
    const { t } = useTranslation();

    console.log("Selected tooth:", selectedTooth);

    const getToothColor = (state: ToothData["status"]["categoryId"]) => {
        switch (state) {
            case 1:
                return "#4CAF50";
            case 2:
                return "#F44336";
            case 3:
                return "#9E9E9E";
            case 4:
                return "#FFC107";
            case 5:
                return "#3F51B5";
            default:
                return colors.white;
        }
    };

    return (
        <>
            <Paper
                elevation={5}
                sx={{
                    p: 4,
                    borderRadius: 3,
                    backgroundColor: colors.color2,
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <Typography variant="h6" sx={{ mb: 3, color: colors.color5 }}>
                    {t("dentalChart.toothDiagram")}
                </Typography>

                <Grid container justifyContent="center" spacing={1} sx={{ mb: 5 }}>
                    {teeth.slice(0, 16).map((tooth) => (
                        // @ts-ignore
                        <Grid item key={tooth.toothNumber}>
                            <Tooltip title={<div>Tooth {tooth.toothNumber} <br></br> {tooth.status.statusName} <br></br> {tooth.status.categoryName}</div>} arrow>
                                <Box
                                    key={tooth.toothNumber}
                                    onClick={() => {
                                        if (setSelectedTooth)
                                            setSelectedTooth(tooth)
                                    }}
                                    sx={{
                                        width: 32,
                                        height: 48,
                                        backgroundColor: getToothColor(tooth.status.categoryId),
                                        borderRadius: 5,
                                        border: selectedTooth?.toothNumber === tooth.toothNumber ? "2px solid #FFD700" : "2px solid transparent",
                                        cursor: "pointer",
                                        transition: "transform 0.2s, box-shadow 0.2s",
                                        "&:hover": {
                                            transform: "scale(1.2)",
                                            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                                        },
                                    }}
                                />
                            </Tooltip>
                        </Grid>
                    ))}
                </Grid>

                <Grid container justifyContent="center" spacing={1}>
                    {teeth.slice(16, 32).map((tooth) => (
                        // @ts-ignore
                        <Grid item key={tooth.toothNumber}>
                            <Tooltip title={<div>Tooth {tooth.toothNumber} <br></br> {tooth.status.statusName} <br></br> {tooth.status.categoryName}</div>} arrow>
                                <Box
                                    key={tooth.toothNumber}
                                    onClick={() => {
                                        if (setSelectedTooth)
                                            setSelectedTooth(tooth)
                                    }}
                                    sx={{
                                        width: 32,
                                        height: 48,
                                        backgroundColor: getToothColor(tooth.status.categoryId),
                                        borderRadius: 5,
                                        border: selectedTooth?.toothNumber === tooth.toothNumber ? "2px solid #FFD700" : "2px solid transparent",
                                        cursor: "pointer",
                                        transition: "transform 0.2s, box-shadow 0.2s",
                                        "&:hover": {
                                            transform: "scale(1.2)",
                                            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                                        },
                                    }}
                                />
                            </Tooltip>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </>
    );
}