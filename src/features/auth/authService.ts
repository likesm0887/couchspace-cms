import cookie from 'react-cookies';

const baseUrl = "https://couchspace-test.azurewebsites.net";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token?: {
    AccessToken: string;
  };
  error?: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const api = baseUrl + "/api/login";
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    };

    try {
      const response = await fetch(api, requestOptions);
      const result = await response.json();
      
      if (result.token?.AccessToken) {
        // Save token to storage
        cookie.save('token', result.token.AccessToken);
        return result;
      } else {
        throw new Error(result.error || '登入失敗');
      }
    } catch (error) {
      throw error;
    }
  },

  logout: (): void => {
    cookie.remove('token');
  },

  getToken: (): string | null => {
    return cookie.load('token') || null;
  },

  isAuthenticated: (): boolean => {
    return !!cookie.load('token');
  },

  clearToken: (): void => {
    cookie.remove('token');
  }
};