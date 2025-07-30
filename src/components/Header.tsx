import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import React from 'react';

export default function Header() {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleLangClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLangClose = (lang?: string) => {
    if (lang) i18n.changeLanguage(lang);
    setAnchorEl(null);
  };

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
          <Button color="inherit">{t('about')}</Button>
          <Button color="inherit">{t('services')}</Button>
          <Button color="inherit" onClick={handleTeamClick}>{t('team')}</Button>
          <Button color="inherit">{t('pricing')}</Button>
          <Button color="inherit">{t('contact')}</Button>
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
          <Button variant="contained" color="primary" onClick={handleLogInClick}>{t('loginText')}</Button>
         
        </Box>
      </Toolbar>
    </AppBar>
  );
}
