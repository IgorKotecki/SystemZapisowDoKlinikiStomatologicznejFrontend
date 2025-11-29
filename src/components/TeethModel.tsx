import {
    Box,
    Typography,
    Paper,
    Tooltip,
    Grid,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import type { ToothData } from "../Interfaces/ToothData"
import { colors } from "../utils/colors";

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
                return colors.greenTooth;
            case 2:
                return colors.redTooth;
            case 3:
                return colors.grayTooth;
            case 4:
                return colors.yellowTooth;
            case 5:
                return colors.blueTooth;
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
                        
                        <Grid key={tooth.toothNumber} component='div'>
                            <Tooltip title={<div># {tooth.toothName} <br></br> {tooth.status.statusName} <br></br> {tooth.status.categoryName}</div>} arrow>
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
                            <Tooltip title={<div># {tooth.toothName} <br></br> {tooth.status.statusName} <br></br> {tooth.status.categoryName}</div>} arrow>
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