import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box, Avatar, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn, logout, userRole, userPhoto } = useAuth();

  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLangOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setLangAnchor(event.currentTarget);
  };
  const handleLangClose = (lang?: string) => {
    if (lang) i18n.changeLanguage(lang);
    setLangAnchor(null);
  };

  const handleUserOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setUserAnchor(event.currentTarget);
  };
  const handleUserClose = () => {
    setUserAnchor(null);
  };

  const handleAccountNavigation = () => {
    handleUserClose();
    const role = userRole || "Unregistered_user";

    switch (role) {
      case "Receptionist":
        navigate("/receptionist/profile");
        break;
      case "Registered_user":
        navigate("/user/profile");
        break;
      case "Admin":
        navigate("/admin");
        break;
      case "Doctor":
        navigate("/doctor/profile");
        break;
      default:
        navigate("/");
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
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src="../public\images\Logo.png" 
              alt="Logo"
              onClick={nav('/')}
              sx={{
                height: 40,             
                width: 'auto',        
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)', 
                },
              }}
            />
          </Box>
          <Box sx={{ flex: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Button color="inherit" onClick={nav('/')}>{t('header.home')}</Button>
            <Button color="inherit" onClick={nav('/about')}>{t('header.aboutUs')}</Button>
            <Button color="inherit" onClick={nav('/services')}>{t('header.services')}</Button>
            <Button color="inherit" onClick={nav('/team')}>{t('header.team')}</Button>
            <Button color="inherit" onClick={nav('/prices')}>{t('header.prices')}</Button>
            <Button color="inherit" onClick={nav('/contacts')}>{t('header.contact')}</Button>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={handleLangOpen}>
              <LanguageIcon />
            </IconButton>
            <Menu
              anchorEl={langAnchor}
              open={Boolean(langAnchor)}
              onClose={() => handleLangClose()}
              disableScrollLock
            >
              <MenuItem onClick={() => handleLangClose('pl')}>Polski</MenuItem>
              <MenuItem onClick={() => handleLangClose('en')}>English</MenuItem>
            </Menu>

            <Button variant="outlined" onClick={nav('/appointment')} sx={{ mx: 1 }}>
              {t('header.book')}
            </Button>

            {isLoggedIn ? (
              <>
                <IconButton onClick={handleUserOpen} sx={{ p: 0.5 }}>
                  <Avatar
                    src={userPhoto || undefined}
                    sx={{ width: 40, height: 40, border: '2px solid #ddd' }}
                  >
                    <AccountCircle />
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={userAnchor}
                  open={Boolean(userAnchor)}
                  onClose={handleUserClose}
                  disableScrollLock
                >
                  <MenuItem onClick={handleAccountNavigation}>{t('header.account')}</MenuItem>
                  <MenuItem onClick={handleLogoutClick}>{t('header.logout')}</MenuItem>
                </Menu>
              </>
            ) : (
              <Button variant="contained" color="primary" onClick={nav('/LogIn')}>
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
        aria-labelledby="logout-dialog-title"
      >
        <DialogTitle id="logout-dialog-title">
          {t('header.confirmTitle')}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {t('header.confirmMessage')}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setLogoutDialogOpen(false)}
            color="inherit"
          >
            {t('header.cancel')}
          </Button>
          <Button
            onClick={handleConfirmLogout}
            variant="contained"
            color="error"
            autoFocus
          >
            {t('header.logout')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}