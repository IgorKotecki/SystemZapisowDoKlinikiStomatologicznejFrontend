import {
    Typography,
    TextField,
    Button,
    Box,
    Paper,
} from '@mui/material';
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { colors } from '../utils/colors';
import post from '../api/post';
import { showAlert } from '../utils/GlobalAlert';


function getQueryParam(name: string) {
    try {
        return new URLSearchParams(window.location.search).get(name);
    } catch {
        return null;
    }
}

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [token, setToken] = useState<string | null>(null);
    const [sentTo, setSentTo] = useState<string | null>(null);
    const [sending, setSending] = useState(false);
    const [resetting, setResetting] = useState(false);
    const isSubmittingRequest = useRef(false);
    const isSubmittingReset = useRef(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const t = getQueryParam("token");
        const e = getQueryParam("email");
        if (t) setToken(t);
        if (e) setEmail(e);
    }, []);

    async function requestReset() {
        if (isSubmittingRequest.current) {
            console.log('Already submitting request, blocked!');
            return;
        }

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            showAlert({ type: "error", message: t('reset.enterValidEmail') });
            return;
        }

        isSubmittingRequest.current = true;
        setSending(true);

        try {
            const payload = {
                email: email
            };

            await post.forgotPassword(payload);

            setEmail("");
            setSentTo(email);
            showAlert({ type: "success", message: t('reset.resetLinkSent') });
        } catch (err: any) {
            showAlert({ type: "error", message: err?.message || t('reset.requestFailed') });
        } finally {
            setSending(false);
            isSubmittingRequest.current = false;
        }
    }

    async function submitNewPassword() {
        if (isSubmittingReset.current) {
            console.log('Already submitting reset, blocked!');
            return;
        }

        if (!token) {
            showAlert({ type: "error", message: t('reset.missingToken') });
            return;
        }
        if (newPassword.length < 8) {
            showAlert({ type: "error", message: t('reset.passwordLength') });
            return;
        }
        if (newPassword !== confirm) {
            showAlert({ type: "error", message: t('reset.passwordMismatch') });
            return;
        }

        isSubmittingReset.current = true;
        setResetting(true);

        try {
            const payload = {
                token: token,
                newPassword: newPassword
            };

            await post.resetPassword(payload);

            showAlert({ type: "success", message: t('reset.successMessage') });
            setNewPassword("");
            setConfirm("");

            navigate('/resetpassword/success');

        } catch (err: any) {
            showAlert({ type: "error", message: err?.message || "Reset failed." });
        } finally {
            setResetting(false);
            isSubmittingReset.current = false;
        }
    }

    return (
        <Box
            sx={{
                height: '100vh',
                backgroundColor: colors.color1,
                display: 'flex',
                justifyContent: 'center',
                p: 2
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    maxWidth: 420,
                    width: '100%',
                    padding: 4,
                    borderRadius: 3,
                    textAlign: 'center',
                    backgroundColor: colors.pureWhite,
                    height: 'fit-content',
                }}
            >
                {!token ? (
                    <>
                        <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, color: colors.black }}>
                            {t('forget.title')}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, color: colors.black, opacity: 0.8 }}>
                            {t('forget.description')}
                        </Typography>

                        <TextField
                            label={t('login.email')}
                            name="email"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(s) => setEmail(s.target.value)}
                            sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                        />

                        {sentTo && <Typography variant="body2" sx={{ mt: 1, color: colors.black, opacity: 0.8 }}>{t('forget.sentTo')}: {sentTo}</Typography>}

                        <Button
                            onClick={requestReset}
                            variant="contained"
                            disabled={sending || !email}
                            fullWidth
                            sx={{
                                mt: 3,
                                backgroundColor: colors.color3,
                                '&:hover': { backgroundColor: colors.color4 },
                                textTransform: 'none'
                            }}
                        >
                            {t('forget.sendResetLink')}
                        </Button>
                    </>
                ) : (
                    <>
                        <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, color: colors.black }}>
                            {t('reset.title')}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, color: colors.black, opacity: 0.8 }}>
                            {t('reset.description')}
                        </Typography>

                        <TextField
                            label={t('reset.newPassword')}
                            name="newPassword"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={newPassword}
                            onChange={(s) => setNewPassword(s.target.value)}
                            sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                            required
                        />
                        <TextField
                            label={t('reset.confirmNewPassword')}
                            name="confirm"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={confirm}
                            onChange={(s) => setConfirm(s.target.value)}
                            sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                            required
                        />

                        <Button
                            onClick={submitNewPassword}
                            variant="contained"
                            disabled={resetting || !newPassword || !confirm}
                            fullWidth
                            sx={{
                                mt: 3,
                                backgroundColor: colors.color3,
                                '&:hover': { backgroundColor: colors.color4 },
                                textTransform: 'none'
                            }}
                        >
                            {t('reset.changePassword')}
                        </Button>
                    </>
                )}
            </Paper>
        </Box>
    );
}