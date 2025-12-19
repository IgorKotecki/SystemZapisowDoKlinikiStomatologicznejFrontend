import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  isLoggedIn: boolean;
  token: string | null;
  refreshToken: string | null;
  userRole: string | null;
  userId: number | null;
  claims: any;
  initialized: boolean;
  userPhoto: string | null;
  updateUserPhoto: (url: string | null) => void;
  login: (token: string, refreshToken: string, photoUrl: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  token: null,
  refreshToken: null,
  userRole: null,
  userId: null,
  claims: null,
  initialized: false,
  userPhoto: null,
  updateUserPhoto: () => { },
  login: () => { },
  logout: () => { },
});

export const AuthProvider = ({ children }: any) => {
  const [initialized, setInitialized] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [claims, setClaims] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Funkcja do aktualizacji zdjęcia w stanie i localStorage
  const updateUserPhoto = (url: string | null) => {
    setUserPhoto(url);
    if (url) {
      window.localStorage.setItem("userPhoto", url);
    } else {
      window.localStorage.removeItem("userPhoto");
    }
  };

  // Inicjalizacja stanu przy starcie aplikacji
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = window.localStorage.getItem("token");
        const storedRefresh = window.localStorage.getItem("refreshToken");
        const storedPhoto = window.localStorage.getItem("userPhoto");

        if (storedToken && storedRefresh) {
          const decoded: any = jwtDecode(storedToken);
          const now = Date.now() / 1000;

          if (decoded.exp && decoded.exp < now) {
            console.log("AuthProvider: token expired on init");
            logoutInternal();
          } else {
            const id = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

            setToken(storedToken);
            setRefreshToken(storedRefresh);
            setClaims(decoded);
            setUserId(id ? Number(id) : null);
            setUserRole(role ?? null);
            setUserPhoto(storedPhoto); // PRZYWRACANIE ZDJĘCIA Z LOCAL STORAGE
            setIsLoggedIn(true);
            console.log("AuthProvider: restored user", { id, role });
          }
        }
      } catch (err) {
        console.error("AuthProvider init error:", err);
        logoutInternal();
      } finally {
        setInitialized(true);
      }
    };

    initAuth();
  }, []);

  const login = (newToken: string, newRefresh: string, photoUrl: string | null) => {
    try {
      const decoded: any = jwtDecode(newToken);
      const id = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      // Aktualizacja stanu
      setToken(newToken);
      setRefreshToken(newRefresh);
      setClaims(decoded);
      setUserId(id ? Number(id) : null);
      setUserRole(role ?? null);
      setIsLoggedIn(true);
      
      // Aktualizacja zdjęcia (używamy funkcji pomocniczej)
      updateUserPhoto(photoUrl);

      // Zapis w localStorage
      window.localStorage.setItem("token", newToken);
      window.localStorage.setItem("refreshToken", newRefresh);
      window.localStorage.setItem("claims", JSON.stringify(decoded));

      console.log("AuthProvider: login successful", { id, role, photoUrl });
    } catch (err) {
      console.error("AuthProvider login error:", err);
      logoutInternal();
    }
  };

  const logoutInternal = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("refreshToken");
    window.localStorage.removeItem("claims");
    window.localStorage.removeItem("userPhoto");

    setToken(null);
    setRefreshToken(null);
    setClaims(null);
    setUserRole(null);
    setUserId(null);
    setIsLoggedIn(false);
    setUserPhoto(null);
  };

  const logout = () => {
    logoutInternal();
  };

  return (
    <AuthContext.Provider
      value={{ 
        isLoggedIn, 
        token, 
        refreshToken, 
        claims, 
        initialized, 
        userId, 
        userRole, 
        userPhoto, 
        updateUserPhoto, 
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);