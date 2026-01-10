import {
    Typography,
    TextField,
    Button,
} from '@mui/material';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { colors } from '../utils/colors';
import post from '../api/post';
import { showAlert } from '../utils/GlobalAlert';

const styles: Record<string, React.CSSProperties> = {
    background: {
        background: colors.color1,
        flex: 1,
    },
    container: {
        maxWidth: 420,
        margin: "48px auto",
        padding: 24,
        border: "1px solid #eee",
        borderRadius: 8,
        boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
        fontFamily: "Inter, Roboto, system-ui, -apple-system, 'Segoe UI', sans-serif",
        background: colors.white
    },
    title: { margin: "0 0 8px", fontSize: 22, color: "black" },
    description: { margin: "0 0 18px", color: "#555", fontSize: 14 },
    field: { display: "flex", flexDirection: "column", marginBottom: 12 },
    label: { marginBottom: 6, fontSize: 13 },
    input: {
        padding: "10px 12px",
        fontSize: 14,
        borderRadius: 6,
        border: "1px solid #ccd",
        outline: "none",
    },
    button: {
        padding: "10px 14px",
        fontSize: 15,
        borderRadius: 6,
        border: "none",
        background: "#0b69ff",
        color: "white",
        cursor: "pointer",
    },
    altButton: {
        marginLeft: 8,
        background: "#f3f4f6",
        color: "#111",
    },
    hint: { marginTop: 12, fontSize: 13, color: "#666" },
    error: { color: "crimson", marginTop: 10 },
    success: { color: "green", marginTop: 10 },
};

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
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const t = getQueryParam("token");
        const e = getQueryParam("email");
        if (t) setToken(t);
        if (e) setEmail(e);
    }, []);

    async function requestReset(e?: React.FormEvent) {
        e?.preventDefault();
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            showAlert({ type: "error", message: t('reset.enterValidEmail') });
            return;
        }
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
        }
    }

    async function submitNewPassword(e?: React.FormEvent) {
        e?.preventDefault();
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
        try {

            const payload = {
                token: token,
                newPassword: newPassword
            };

            var res = await post.resetPassword(payload);

            showAlert({ type: "success", message: t('reset.successMessage') });
            setNewPassword("");
            setConfirm("");

            if (res.status === 200) {
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            }

        } catch (err: any) {
            showAlert({ type: "error", message: err?.message || "Reset failed." });
        }
    }

    return (
        <div style={styles.background}>
            <div style={styles.container}>
                {!token ? (
                    <>
                        <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, color: colors.color1 }}>
                            {t('forget.title')}
                        </Typography>
                        <p style={styles.description}>
                            {t('forget.description')}
                        </p>
                        <form onSubmit={requestReset}>
                            <TextField
                                label={t('login.email')}
                                name="email"
                                fullWidth
                                margin="normal"
                                value={email}
                                onChange={(s) => setEmail(s.target.value)}
                                sx={{ backgroundColor: colors.white, borderRadius: 1 }}
                            />
            
                            {sentTo && <div style={styles.hint}>Sent to: {sentTo}</div>}
                            <Button
                                type="submit"
                                variant="contained"
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
                        </form>
                    </>
                ) : (
                    <>
                        <Typography variant="h5" sx={{ textAlign: 'center', mb: 3, color: colors.color1 }}>
                            {t('reset.title')}
                        </Typography>
                        <p style={styles.description}>{t('reset.description')}</p>

                        <form onSubmit={submitNewPassword}>
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
                                type="submit"
                                variant="contained"
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

                        </form>
                        
                    </>
                )}
            </div>
        </div>
    );
}