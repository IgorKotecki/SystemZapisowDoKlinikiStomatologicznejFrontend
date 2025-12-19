import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box, Avatar } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React from 'react';

export default function Header() {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [userAnchor, setUserAnchor] = React.useState<null | HTMLElement>(null);
  const { isLoggedIn, logout, claims, userRole, userPhoto } = useAuth(); 
  const navigate = useNavigate();

  const getUserRole = () => userRole || "Unregistered_user";

   console.log(isLoggedIn, userPhoto)


  const handleLangClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLangClose = (lang?: string) => {
    if (lang) i18n.changeLanguage(lang);
    setAnchorEl(null);
  };

  const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => setUserAnchor(event.currentTarget);
  const handleUserClose = () => setUserAnchor(null);

  const handleAccount = () => {
    const role = getUserRole();
    handleUserClose();
    switch (role) {
      case "Receptionist": navigate("/receptionist/profile"); break;
      case "Registered_user": navigate("/user/profile"); break;
      case "Admin": navigate("/admin"); break;
      case "Doctor": navigate("/doctor/profile"); break;
      default: navigate("/");
    }
  };

  const handleLogout = () => {
    logout();
    handleUserClose();
    navigate('/');
  };

  const handleAppointmentClick = () => navigate('/appointment');
  const handleLogInClick = () => navigate('/LogIn');
  const handleTeamClick = () => navigate('/team');
  const handleHomeClick = () => navigate('/');
  const handleAboutUsClick = () => navigate('/about');
  const handleServices = () => navigate('/services');
  const handlePrices = () => navigate('/prices');
  const handleContacts = () => navigate('/contacts');

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h6" 
            color="inherit" 
            sx={{ cursor: 'pointer', fontWeight: 'bold' }} 
            onClick={handleHomeClick}
          >
            Klinika
          </Typography>
        </Box>

        <Box sx={{ flex: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button color="inherit" onClick={handleHomeClick}>{t('homeText')}</Button>
          <Button color="inherit" onClick={handleAboutUsClick}>{t('about.about')}</Button>
          <Button color="inherit" onClick={handleServices}>{t('services')}</Button>
          <Button color="inherit" onClick={handleTeamClick}>{t('team')}</Button>
          <Button color="inherit" onClick={handlePrices}>{t('pricing')}</Button>
          <Button color="inherit" onClick={handleContacts}>{t('contact')}</Button>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={handleLangClick}>
            <LanguageIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleLangClose()}>
            <MenuItem onClick={() => handleLangClose('pl')}>Polski</MenuItem>
            <MenuItem onClick={() => handleLangClose('en')}>English</MenuItem>
          </Menu>

          <Button variant="outlined" onClick={handleAppointmentClick} sx={{ mr: 1 }}>
            {t('book')}
          </Button>

          {isLoggedIn ? (
            <>
              <IconButton onClick={handleUserClick} sx={{ p: 0.5 }}>
                <Avatar 
                  src={userPhoto || undefined} 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    border: `2px solid #ddd`,
                    backgroundColor: '#eee' 
                  }}
                >
                  {!userPhoto && <AccountCircle sx={{ width: 40, height: 40, color: '#999' }} />}
                </Avatar>
              </IconButton>
              <Menu 
                anchorEl={userAnchor} 
                open={Boolean(userAnchor)} 
                onClose={handleUserClose}
                disableScrollLock={true} 
              >
                <MenuItem onClick={handleAccount}>{t('account')}</MenuItem>
                <MenuItem onClick={handleLogout}>{t('logout')}</MenuItem>
              </Menu>
            </>
          ) : (
            <Button variant="contained" color="primary" onClick={handleLogInClick}>
              {t('loginText')}
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}