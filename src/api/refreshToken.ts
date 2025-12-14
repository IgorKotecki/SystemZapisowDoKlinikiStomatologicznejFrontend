import { storage } from "../utils/storage";

export async function refreshTokenFlow() {
  const refreshToken = window.localStorage.getItem("refreshToken");
  if (!refreshToken) return false;

  try {
    const res = await fetch("http://localhost:5114/api/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return false;

    const data = await res.json();

    const { accessToken, refreshToken: newRefresh } = data;

    console.log(data);

    storage.removeToken();
    storage.removeRefreshToken();

    storage.setToken(accessToken);
    storage.setRefreshToken(newRefresh);

    console.log("🔄 Token refreshed!");

    return true;
  } catch (err) {
    console.error("Refresh token error:", err);
    return false;
  }
}
