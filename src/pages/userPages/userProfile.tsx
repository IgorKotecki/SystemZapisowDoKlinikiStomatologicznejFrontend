import { Box, Typography, Button, Grid, Card, CardContent, Avatar } from "@mui/material";
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import LeftNavigation from "../../components/userComponents/leftNavigation";

export default function userProfile() {
    const { t } = useTranslation();


    return (
        <LeftNavigation/>
    );

}