import { colors } from "../utils/colors";
import { Box, DialogContentText } from "@mui/material";
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
import { useState } from "react";
import TextField from '@mui/material/TextField';
import api from "../api/axios";
import Alert from '@mui/material/Alert';
import { useEffect } from "react";

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
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const newInfoPl = data.get('infoPl') as string;
        const newInfoEn = data.get('infoEn') as string;

        const addInfoPayload = {
            bodyPl: newInfoPl,
            bodyEn: newInfoEn,
        };

        await api.post<AddInfo>('/api/Appointment/createAddInformation', addInfoPayload)
            .then((response) => {
                console.log('Additional info added:', response.data);
                const newItem: AddInfo = {
                    id: response.data.id,
                    body: response.data.body,
                };

                const currentAddInfo = addInfo || [];
                const newAddInfoArray = [...currentAddInfo, newItem];

                setAddInfo(newAddInfoArray);
                setOpenModal(false);
                setAlert({ type: 'success', message: t('addInfo.addInfoAdded') });
            })
            .catch((error) => {
                console.error('Error adding additional info:', error);
                setAlert({ type: 'error', message: t('addInfo.addInfoError') });
            });
    }

    return (
        <Box sx={{
            p: 4,
            pt: 1,
            borderRadius: 3,
            backgroundColor: colors.white,
            color: colors.black,
            display: "flex",
            flexDirection: "column",
            '& p': { m: 1 },
            height: 300,
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

            <IconButton aria-label="add" sx={{ width: 40, height: 40, mt: 2 }} onClick={handleAddAdditionalInfo}>
                <AddIcon />
            </IconButton>

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
            {alert &&
                <Alert severity={alert.type}>{alert.message}</Alert>
            }
        </Box>
    );
}