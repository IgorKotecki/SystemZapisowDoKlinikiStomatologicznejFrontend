import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Menu, MenuItem, Box, Avatar, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import AccountCircle from '@mui/icons-material/AccountCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { colors } from "../utils/colors";

export default function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn, logout, userRole, userPhoto } = useAuth();

  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // Zmieniono typ z HTMLButtonElement na HTMLElement, aby Box nie wywalał błędu
  const handleLangOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchor(event.currentTarget);
  };

  const handleLangClose = (lang?: string) => {
    if (lang) i18n.changeLanguage(lang);
    setLangAnchor(null);
  };

  const handleUserOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserAnchor(event.currentTarget);
  };

  const handleUserClose = () => {
    setUserAnchor(null);
  };

  const handleAccountNavigation = () => {
    handleUserClose();
    const role = userRole || "Unregistered_user";

    switch (role) {
      case "Receptionist": navigate("/receptionist/profile"); break;
      case "Registered_user": navigate("/user/profile"); break;
      case "Admin": navigate("/admin"); break;
      case "Doctor": navigate("/doctor/profile"); break;
      default: navigate("/");
    }
  };

  const handleLogoutClick = () => {
    handleUserClose();
    setLogoutDialogOpen(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setLogoutDialogOpen(false);
    navigate('/');
  };

  const nav = (path: string) => () => navigate(path);

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: colors.white,
          color: colors.color1,
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>

          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src="/images/Logo.png"
              alt="Logo"
              onClick={nav('/')}
              sx={{
                height: 45,
                width: 'auto',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            />
          </Box>
          <Box sx={{ flex: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
            {[
              { label: t('header.home'), path: '/' },
              { label: t('header.aboutUs'), path: '/about' },
              { label: t('header.services'), path: '/services' },
              { label: t('header.team'), path: '/team' },
              { label: t('header.prices'), path: '/prices' },
              { label: t('header.contact'), path: '/contacts' },
            ].map((item) => (
              <Button
                key={item.path}
                onClick={nav(item.path)}
                sx={{
                  color: colors.color1,
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': { color: colors.color3, backgroundColor: 'transparent' }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
            <Box
              onClick={handleLangOpen}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                color: colors.color1,
                '&:hover': { color: colors.color3 }
              }}
            >
              <LanguageIcon fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                {i18n.language}
              </Typography>
              <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
            </Box>

            <Menu
              anchorEl={langAnchor}
              open={Boolean(langAnchor)}
              onClose={() => handleLangClose()}
              disableScrollLock
              PaperProps={{ sx: { mt: 1, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}
            >
              <MenuItem onClick={() => handleLangClose('pl')} sx={{ fontWeight: i18n.language === 'pl' ? 'bold' : 'normal' }}>Polski</MenuItem>
              <MenuItem onClick={() => handleLangClose('en')} sx={{ fontWeight: i18n.language === 'en' ? 'bold' : 'normal' }}>English</MenuItem>
            </Menu>
            {(!isLoggedIn || (isLoggedIn && userRole === 'Registered_user')) && (
              <Button
                variant="outlined"
                onClick={() => navigate(isLoggedIn ? '/user/makeAppointment' : '/appointment')}
                sx={{
                  borderColor: colors.color3,
                  color: colors.color3,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderRadius: '20px',
                  px: 3,
                  '&:hover': { borderColor: colors.color4, backgroundColor: 'rgba(0,121,135,0.04)' }
                }}
              >
                {t('header.book')}
              </Button>
            )}


            {isLoggedIn ? (
              <>
                <Box
                  component="div"
                  onClick={handleUserOpen}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    cursor: 'pointer',
                    p: 0.5,
                    borderRadius: '25px',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                  }}
                >
                  <Avatar
                    src={userPhoto || undefined}
                    sx={{
                      width: 38,
                      height: 38,
                      border: `2px solid ${colors.color3}`,
                      backgroundColor: colors.color3
                    }}
                  >
                    <AccountCircle />
                  </Avatar>
                  <KeyboardArrowDownIcon sx={{ color: colors.color1, fontSize: 18 }} />
                </Box>
                <Menu
                  anchorEl={userAnchor}
                  open={Boolean(userAnchor)}
                  onClose={handleUserClose}
                  disableScrollLock
                  PaperProps={{
                    sx: { mt: 1, minWidth: 180, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }
                  }}
                >
                  <MenuItem onClick={handleAccountNavigation} sx={{ py: 1.5 }}>{t('header.account')}</MenuItem>
                  <MenuItem onClick={handleLogoutClick} sx={{ py: 1.5, color: 'error.main' }}>{t('header.logout')}</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={nav('/LogIn')}
                sx={{
                  backgroundColor: colors.color1,
                  color: colors.white,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  borderRadius: '20px',
                  px: 3,
                  '&:hover': { backgroundColor: colors.color2 }
                }}
              >
                {t('header.login')}
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        disableScrollLock
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: colors.color1 }}>
          {t('header.confirmTitle')}
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            {t('header.confirmMessage')}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setLogoutDialogOpen(false)}
            sx={{ color: colors.color6, textTransform: 'none', fontWeight: 'bold' }}
          >
            {t('header.cancel')}
          </Button>
          <Button
            onClick={handleConfirmLogout}
            variant="contained"
            sx={{
              backgroundColor: colors.color1,
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#d32f2f' }
            }}
          >
            {t('header.logout')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}