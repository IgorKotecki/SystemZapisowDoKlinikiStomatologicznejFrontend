import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import UserNavigation from "../../components/userComponents/userNavigation";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ro } from "date-fns/locale";
// import api from "../../api/axios";
import { colors } from "../../utils/colors";
import type { User } from "../../Interfaces/User";
import { useAuth } from "../../context/AuthContext";

const ReceptionistUsers: React.FC = () => {
  const {userRole} = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {

        setUsers([
          { id: 1, firstName: "Jan", lastName: "Kowalski", phone: "+48 600 111 222", email: "dsdsd" },
          { id: 2, firstName: "Anna", lastName: "Nowak", phone: "+48 600 333 444", email: "dsdsd" },
          { id: 3, firstName: "Piotr", lastName: "Wiśniewski", phone: "+48 600 555 666", email: "dsdsd" },
        ]);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleUserClick = (userId: number) => {
    // const claims = jwtDecode(localStorage.getItem("token"));
    const role  = userRole; //claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    if(role == "Doctor"){
      navigate(`/doctor/users/${userId}`);
    }else if (role == "Receptionist"){
      navigate(`/receptionist/users/${userId}`);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        width: "100%",
        minHeight: "100vh",
        backgroundColor: colors.color1,
      }}
    >
      <UserNavigation />

      <Box
        component="main"
        sx={{
          flex: 1,
          px: { xs: 2, md: 8 },
          py: 6,
          color: colors.white,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 1500 }}>
          <Typography variant="h4" gutterBottom sx={{ color: colors.color5 }}>
           {t("receptionistUsers.title")}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 3 }}>
            {t("receptionistUsers.subtitle")}
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress sx={{ color: colors.color5 }} />
            </Box>
          ) : (
            <Paper
              elevation={4}
              sx={{
                borderRadius: 3,
                backgroundColor: colors.color2,
                overflow: "hidden",
              }}
            >
              <Box sx={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: colors.color3 }}>
                      {["id", "firstName", "lastName", "phone"].map((key) => (
                        <th
                          key={key}
                          style={{
                            padding: "16px",
                            textAlign: "left",
                            color: colors.white,
                            fontWeight: 600,
                          }}
                        >
                          {t(`receptionistUsers.${key}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        onClick={() => handleUserClick(user.id)}
                        style={{
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          backgroundColor: colors.color2,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = colors.color3)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = colors.color2)
                        }
                      >
                        <td style={{ padding: "16px", color: colors.white }}>{user.id}</td>
                        <td style={{ padding: "16px", color: colors.white }}>{user.firstName}</td>
                        <td style={{ padding: "16px", color: colors.white }}>{user.lastName}</td>
                        <td style={{ padding: "16px", color: colors.white }}>{user.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ReceptionistUsers;
