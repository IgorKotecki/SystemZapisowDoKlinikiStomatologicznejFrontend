import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, Typography, ButtonBase, Divider } from "@mui/material";
import {
  User,
  Users,
  Calendar,
  Bluetooth as Tooth,
  CalendarPlus,
  ShieldCheck,
  Settings2,
  Smile
} from "lucide-react";
import { useTranslation } from "react-i18next";

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
    const r = role.toLowerCase();
    if (r.includes("admin")) return "Admin";
    if (r.includes("user") || r.includes("registered")) return "User";
    if (r.includes("receptionist")) return "Receptionist";
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
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const role = useMemo(() => getUserRoleFromToken(), []);

  const navItems = useMemo(() => {
    // User
    const baseItemsTranslated = [
      { href: "/user/profile", label: t('userNavigation.myProfile'), icon: User, roles: ["User", "Admin"] },
      { href: "/user/appointments", label: t('userNavigation.myAppointments'), icon: Calendar, roles: ["User", "Admin"] },
      { href: "/user/teeth", label: t('userNavigation.teeth'), icon: Smile, roles: ["User", "Admin"] },
      { href: "/user/makeAppointment", label: t('userNavigation.makeAnAppointment'), icon: CalendarPlus, roles: ["User", "Admin"] },
    ];

    // Receptionist
    const receptionistTranslated = [
      { href: "/receptionist/profile", label: t("receptionistNavigation.profile"), icon: User, roles: ["Receptionist"] },
      { href: "/receptionist/calendar", label: t("receptionistNavigation.visits"), icon: Calendar, roles: ["Receptionist"] },
      { href: "/receptionist/users", label: t("receptionistNavigation.users"), icon: Users, roles: ["Receptionist"] },
      { href: "/receptionist/schedule", label: t("receptionistNavigation.scheduleVisit"), icon: CalendarPlus, roles: ["Receptionist"] },
      { href: "/receptionist/services", label: t("receptionistNavigation.editServices"), icon: Settings2, roles: ["Receptionist"] },
    ];

    // Admin
    const adminTranslated = [
      { href: "/admin", label: "Panel Admina", icon: ShieldCheck, roles: ["Admin"] },
    ];

    if (role === "Receptionist") return receptionistTranslated;
    const items = [...baseItemsTranslated];
    if (role === "Admin") items.push(...adminTranslated);
    return items.filter(it => it.roles.includes(role));
  }, [role, i18n.language]);

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
          {t("userNavigation.panel")}
        </Typography>
        <Typography variant="body2" sx={{ color: colors.white, mb: 3 }}>
          {t("userNavigation.role")}: {role}
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
