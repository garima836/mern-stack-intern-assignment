
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }){
  const [user, setUser] = useState(()=> {
    try {
      const raw = localStorage.getItem('auth_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  useEffect(()=> {
    if (user) localStorage.setItem('auth_user', JSON.stringify(user));
    else localStorage.removeItem('auth_user');
  }, [user]);

  const login = (data) => {
    // expects { token, user }
    localStorage.setItem('auth_token', data.token);
    setUser(data.user);
  };
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);
    window.location.href = '/login';
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

export function authFetch(path, opts={}){
  const token = localStorage.getItem('auth_token');
  return fetch((process.env.REACT_APP_API_BASE||'http://localhost:5000') + path, {
    ...opts,
    headers: { 'Content-Type':'application/json', ...(opts.headers||{}), ...(token?{ Authorization: 'Bearer '+token }:{}) }
  });
}
