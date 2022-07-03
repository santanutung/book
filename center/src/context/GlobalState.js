import React, {createContext, useContext, useEffect, useState} from 'react';

import jwt_decode from "jwt-decode";
export const GlobalContext = createContext();
export const GlobalState = ({children}) => {
  const [loaderState, setLoaderState] = useState('');
  const [globalCenterId, setGlobalCenterId] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);

// useEffect(() => {
//     console.log(localStorage.getItem('activeCenter'), 'global');
//     if(localStorage.getItem('activeCenter') != null) {

//       var decoded = jwt_decode(localStorage.getItem('activeCenter'));
//       setGlobalCenterId(decoded)
//       console.log(decoded.centerId, "decorder");
//     }
// }, [])

  return (
    <GlobalContext.Provider
      value={{
        loaderState,
        setLoaderState,
        mobileMenu, setMobileMenu
      }}>
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobalContexts = () => useContext(GlobalContext);

export default useGlobalContexts;