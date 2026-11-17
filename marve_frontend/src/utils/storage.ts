const STORAGE_KEYS = {
  ACCESS_TOKEN: "marve_user_access_token",
  REFRESH_TOKEN: "marve_user_refresh_token",
  USER: "marve_user",
};

export interface AuthUser {
  id: number | string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  offersOptIn: boolean;
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
  lastLoginAt: string | null;
}

export const saveAccessToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
};

export const updateAccessToken = (token: string): void => {
  saveAccessToken(token);
};

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

export const hasAccessToken = (): boolean => {
  return Boolean(getAccessToken());
};

export const removeAccessToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
};

export const saveRefreshToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
};

export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

export const hasRefreshToken = (): boolean => {
  return Boolean(getRefreshToken());
};

export const removeRefreshToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};

export const saveUser = (user: AuthUser): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  if (!user) return null;
  try {
    return JSON.parse(user) as AuthUser;
  } catch {
    removeUser();
    return null;
  }
};

export const removeUser = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.USER);
};

export const isAuthenticated = (): boolean => {
  return hasAccessToken();
};

export const clearAuth = (): void => {
  removeAccessToken();
  removeRefreshToken();
  removeUser();
};