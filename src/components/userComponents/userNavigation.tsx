import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  ButtonBase,
  Divider,
} from "@mui/material";
import {
  User,
  Calendar,
  Bluetooth as Tooth,
  CalendarPlus,
  ShieldCheck,
} from "lucide-react";
import { useTranslation } from 'react-i18next';

function decodeJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function getUserRoleFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return "Unregistered";

  const claims = decodeJwt(token);
  if (!claims) return "Unregistered";

  const msRole =
    claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  const simpleRole =
    claims.role || (Array.isArray(claims.roles) ? claims.roles[0] : null);

  const role = msRole || simpleRole || "Unregistered";

  if (typeof role === "string") {
    if (role.toLowerCase().includes("admin")) return "Admin";
    if (role.toLowerCase().includes("user") || role.toLowerCase().includes("registered"))
      return "User";
  }

  return "Unregistered";
}

const colors = {
  color1: "#003141",
  color2: "#004f5f",
  color3: "#007987",
  color4: "#00b2b9",
  color5: "#00faf1",
  white: "#ffffff",
};

export default function UserNavigation() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const role = useMemo(() => getUserRoleFromToken(), []);

  const baseItems = [
    { href: "/user/profile", label: t('userNavigation.myProfile'), icon: User, roles: ["User", "Admin"] },
    { href: "/user/appointments", label: t('userNavigation.myAppointments'), icon: Calendar, roles: ["User", "Admin"] },
    { href: "/user/teeth", label: t('userNavigation.teeth'), icon: Tooth, roles: ["User", "Admin"] },
    { href: "/user/makeAppointment", label: t('userNavigation.makeAnAppointment'), icon: CalendarPlus, roles: ["User", "Admin"] },
  ];

  const adminItems = [
    { href: "/admin", label: "Panel Admina", icon: ShieldCheck, roles: ["Admin"] },
  ];

  const navItems = useMemo(() => {
    const items = [...baseItems];
    if (role === "Admin") items.push(...adminItems);
    return items.filter((it) => it.roles.includes(role));
  }, [role]);

  return (
    <Box
      sx={{
        width: { xs: "100%", md: 260 },
        minHeight: { xs: "auto", md: "100vh" },
        backgroundColor: colors.color2,
        borderRight: `2px solid ${colors.color3}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        py: 4,
        px: 3,
      }}
    >
      <Box>
        <Typography variant="h5" sx={{ color: colors.color5, mb: 1 }}>
         {t('userNavigation.panel')}
        </Typography>
        <Typography variant="body2" sx={{ color: colors.white, mb: 3 }}>
          {t('userNavigation.role')}: {role}
        </Typography>
        <Divider sx={{ borderColor: colors.color3, mb: 2 }} />

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <ButtonBase
              key={item.href}
              component={isActive ? "div" : Link}
              to={isActive ? undefined : item.href}
              disabled={isActive} 
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 2,
                px: 2,
                py: 1.5,
                mb: 1,
                borderRadius: 2,
                color: colors.white,
                backgroundColor: isActive ? colors.color3 : "transparent",
                cursor: isActive ? "default" : "pointer",
                opacity: isActive ? 0.8 : 1,
                "&:hover": {
                  backgroundColor: isActive ? colors.color3 : colors.color4,
                },
                transition: "background-color 0.2s",
              }}
            >
              <Icon size={20} />
              <Typography variant="body1">{item.label}</Typography>
            </ButtonBase>
          );
        })}
      </Box>

      <Typography
        variant="caption"
        align="center"
        sx={{ color: "#cccccc", mt: 4 }}
      >
        © 2025 DentalCare
      </Typography>
    </Box>
  );
}
