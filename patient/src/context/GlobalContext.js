import React, { createContext, useContext, useEffect, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalState = ({ children }) => {
  const [loginState, setLoginState] = useState('');
  const [loaderState, setLoaderState] = useState(false);
  const [forgotPasswordState, setForgotPasswordState] = useState(false);
  const [userName, setUserName] = useState('')
  const [homeIndex, setHomeIndex] = useState('')
  const [removeNotification, setremoveNotification] = useState(false);

  useEffect(() => {
    setUserName(localStorage.getItem('du_name'))
  }, []);



  return (
    <GlobalContext.Provider
      value={{
        removeNotification,
        setremoveNotification,
        loginState,
        setLoginState,
        loaderState,
        setLoaderState,
        setForgotPasswordState,
        forgotPasswordState,
        userName,
        setUserName,
      }}
    >
      {children}
    </GlobalContext.Provider>




  );
};

const useGlobalContexts = () => useContext(GlobalContext);

export default useGlobalContexts;