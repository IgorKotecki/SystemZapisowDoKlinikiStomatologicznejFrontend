import { storage } from "../utils/storage";

export async function refreshTokenFlow() {
  const refreshToken = window.localStorage.getItem("refreshToken");
  if (!refreshToken) return false;

  try {
    const res = await fetch("http://localhost:5114/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return false;

    const data = await res.json();

    const { accessToken, refreshToken: newRefresh } = data;

    window.localStorage.removeItem("token")
    window.localStorage.removeItem("refresh")
    window.localStorage.setItem("token", accessToken);
    window.localStorage.setItem("refresh", newRefresh);

    console.log("Token refreshed!");

    return true;
  } catch (err) {
    console.error("Refresh token error:", err);
    return false;
  }
}
