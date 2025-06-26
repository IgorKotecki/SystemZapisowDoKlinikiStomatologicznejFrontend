const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const storage = {
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  getToken: () => localStorage.getItem(TOKEN_KEY),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),

  setUser: (user: any) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  removeUser: () => localStorage.removeItem(USER_KEY),

  clearAll: () => localStorage.clear()
};
