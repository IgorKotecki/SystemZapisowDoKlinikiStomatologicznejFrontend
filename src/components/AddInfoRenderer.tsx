import { colors } from "../utils/colors";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import type { AddInfo } from "../Interfaces/AddInfo";
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useState, useRef, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import i18n from "../i18n";
import post from "../api/post";

type AddInfoRendererProps = {
    addInfo?: AddInfo[];
    checked?: AddInfo[];
    setAddInfo?: (addInfo: AddInfo[]) => void;
    setChecked?: (addInfo: AddInfo[]) => void;
}

export default function AddInfoRenderer({ addInfo, checked, setChecked, setAddInfo }: AddInfoRendererProps) {
    const { t } = useTranslation();
    const [openModal, setOpenModal] = useState(false);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [infoPl, setInfoPl] = useState('');
    const [infoEn, setInfoEn] = useState('');
    const isSubmitting = useRef(false);

    if (!addInfo || !checked || !setChecked || !setAddInfo) {
        return <div>Loading...</div>;
    }

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [alert]);

    const handleToggle = (value: AddInfo) => () => {
        const currentIndex = checked.findIndex((item) => item.id === value.id);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleAddAdditionalInfo = () => {
        setOpenModal(true);
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
            setAddInfo([...addInfo, response]);
            setAlert({ type: 'success', message: t('addInfo.addInfoSuccess') });
            handleCloseModal();
        } catch (error) {
            setAlert({ type: 'error', message: t('addInfo.addInfoError') });
        } finally {
            setSubmitting(false);
            isSubmitting.current = false;
        }
    };

    return (
        <Box sx={{
            p: 4,
            pt: 1,
            borderRadius: 3,
            backgroundColor: colors.pureWhite,
            color: colors.black,
            display: "flex",
            flexDirection: "column",
            '& p': { m: 1 },
            height: "300px",
        }}>
            <h2 style={{ color: colors.black }}>{t('addInfo.title')}</h2>
            <List sx={{ width: '100%', position: "relative", overflow: 'auto', maxHeight: 300, bgcolor: 'background.paper' }}>
                {addInfo.map((value) => {
                    const labelId = `checkbox-list-label-${value.id}`;

                    return (
                        <ListItem
                            key={value.id}
                            disablePadding
                        >
                            <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={checked.some((item) => item.id === value.id)}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={value.body} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <IconButton 
                aria-label="add" 
                sx={{ width: 40, height: 40, mt: 2 }} 
                onClick={handleAddAdditionalInfo} 
                disabled={submitting}
            >
                <AddIcon />
            </IconButton>

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

            {alert &&
                <Alert 
                    style={{ 
                        position: "fixed", 
                        bottom: 24, 
                        right: 24, 
                        zIndex: 2000, 
                        minWidth: 300, 
                        boxShadow: "0px 4px 12px rgba(0,0,0,0.3)" 
                    }} 
                    severity={alert.type}
                >
                    {alert.message}
                </Alert>
            }
        </Box>
    );
}