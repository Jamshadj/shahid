import { getStoreSettings } from './data-service';

export interface UserSession {
  email: string;
  role: 'admin' | 'staff';
  authenticatedAt: string;
}

const AUTH_KEY = 'quickbill_staff_auth';
export const MASTER_ACCESS_CODE = '086421';

export function getSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(AUTH_KEY);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

export async function loginWithCode(code: string): Promise<boolean> {
  const cleanCode = code.trim();

  // 1. Strict Master Access Code Check (086421)
  if (cleanCode === MASTER_ACCESS_CODE) {
    const session: UserSession = {
      email: 'staff@galaxy.com',
      role: 'admin',
      authenticatedAt: new Date().toISOString(),
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    document.cookie = `quickbill_auth=true; path=/; max-age=86400`;
    return true;
  }

  // 2. Strict Database Check against store_settings.staff_access_code
  try {
    const settings = await getStoreSettings();
    if (settings && settings.staff_access_code && cleanCode === settings.staff_access_code.trim()) {
      const session: UserSession = {
        email: 'staff@galaxy.com',
        role: 'admin',
        authenticatedAt: new Date().toISOString(),
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      document.cookie = `quickbill_auth=true; path=/; max-age=86400`;
      return true;
    }
  } catch (err) {
    console.warn('Database access code check error:', err);
  }

  // Strictly reject all other codes
  return false;
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
    document.cookie = `quickbill_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getSession());
}
