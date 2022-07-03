import React, {createContext, useContext, useState} from 'react';

export const GlobalContext = createContext();

export const GlobalState = ({children}) => {
  const [loadingState, setLoadingState] = useState('');

  const [sidebar, setSidebar] = useState(false);
  const [chatCenter, setChatCenter] = useState();


  return (
    <GlobalContext.Provider
      value={{
        loadingState,
        setLoadingState,
        sidebar, setSidebar,
        chatCenter, setChatCenter
      }}>
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobalContexts = () => useContext(GlobalContext);

export default useGlobalContexts;