import { storage } from "../utils/storage";
import post from "./post";

export async function refreshTokenFlow() {
  const refreshToken = storage.getRefreshToken();
  if (!refreshToken) return false;

  try {
    const data = await post.refreshToken({ refreshToken });
    
    const { accessToken, refreshToken: newRefresh } = data;

    console.log("🔄 Token refreshed!", data);

    storage.setToken(accessToken);
    storage.setRefreshToken(newRefresh);

    return await accessToken; 
  } catch (err) {
    console.error("Refresh token error:", err);
    storage.clear(); 
    return false;
  }
}
