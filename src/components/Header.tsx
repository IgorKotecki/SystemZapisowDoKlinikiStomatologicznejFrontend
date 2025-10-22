import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import React from 'react';
import { ro } from 'date-fns/locale';
import { jwtDecode } from "jwt-decode";

export default function Header() {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [userAnchor, setUserAnchor] = React.useState<null | HTMLElement>(null);
  const { isLoggedIn, setLoggedIn } = useAuth();
  const navigate = useNavigate();


  //  React.useEffect(() => {
  //   const handleStorageChange = () => setIsLoggedIn(storage.isLoggedIn());
  //   window.addEventListener("storage", handleStorageChange);
  //   return () => window.removeEventListener("storage", handleStorageChange);
  // }, []);

  const getUserRole = () => {
    const token = storage.getToken();
    if (!token) return "Unregistered_user";
    try {
      const claims: any = jwtDecode(token);
      return (
        claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        claims.role ||
        claims.Role ||
        claims.roles?.[0] ||
        "Unregistered_user"
      );
    } catch {
      return "Unregistered_user";
    }
  };


  // handlery do zmiany jezyków
  const handleLangClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLangClose = (lang?: string) => {
    if (lang) i18n.changeLanguage(lang);
    setAnchorEl(null);
  };

  //handlery do zarządziania stanem zalogowania 
  const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => setUserAnchor(event.currentTarget);
  const handleUserClose = () => setUserAnchor(null);

  // const handleAccount = () => {
  //   handleUserClose();
  //   navigate('/user/profile');
  // };
  const handleAccount = () => {
    const role = getUserRole();
    console.log(role);
    handleUserClose();
    if (role === "Receptionist") {
      navigate("/receptionist/profile");
    } else if (role === "Registered_user") {
      navigate("/user/profile");
    } else if (role === "Admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };


  const handleLogout = () => {
    storage.clearAll();
    setLoggedIn(false);
    handleUserClose();
    navigate('/');
  };

  //basic guziki
  const handleAppointmentClick = () => {
    navigate('/appointment');
  }

  const handleLogInClick = () => {
    navigate('/LogIn');
  }

  const handleTeamClick = () => {
    navigate('/team');
  }

  const handleHomeClick = () => {
    navigate('');
  }

  const handleAboutUsClick = () => {
    navigate('/about');
  }

  const handleServices = () => {
    navigate('/services');
  }

  const handlePrices = () => {
    navigate('/prices');
  }

  const handleContacts = () => {
    navigate('/contacts');
  }

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" color="inherit">
            Logo
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 2,
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Button color="inherit" onClick={handleHomeClick}>{t('homeText')}</Button>
          <Button color="inherit" onClick={handleAboutUsClick}>{t('about.about')}</Button>
          <Button color="inherit" onClick={handleServices}>{t('services')}</Button>
          <Button color="inherit" onClick={handleTeamClick}>{t('team')}</Button>
          <Button color="inherit" onClick={handlePrices}>{t('pricing')}</Button>
          <Button color="inherit" onClick={handleContacts}>{t('contact')}</Button>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <IconButton onClick={handleLangClick}>
            <LanguageIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => handleLangClose()}
          >
            <MenuItem onClick={() => handleLangClose('pl')}>Polski</MenuItem>
            <MenuItem onClick={() => handleLangClose('en')}>English</MenuItem>
          </Menu>

          <Button variant="outlined" onClick={handleAppointmentClick}>{t('book')}</Button>

          {isLoggedIn ? (
            <>
              <IconButton onClick={handleUserClick}>
                <AccountCircle />
              </IconButton>
              <Menu anchorEl={userAnchor} open={Boolean(userAnchor)} onClose={handleUserClose}>
                <MenuItem onClick={handleAccount}>{t('account')}</MenuItem>
                <MenuItem onClick={handleLogout}>{t('logout')}</MenuItem>
              </Menu>
            </>
          ) : (
            <Button variant="contained" color="primary" onClick={handleLogInClick}>{t('loginText')}</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
