import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => localStorage.getItem('ponyu_user') || null);

  useEffect(() => {
    document.body.className = '';
    if (user === 'jaime') {
      document.body.classList.add('theme-jaime');
    } else if (user === 'maialen') {
      document.body.classList.add('theme-maialen');
    }
    
    if (user) {
      localStorage.setItem('ponyu_user', user);
    } else {
      localStorage.removeItem('ponyu_user');
    }
  }, [user]);

  const login = (selectedUser) => setUser(selectedUser);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
