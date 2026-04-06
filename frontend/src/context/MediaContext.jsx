import { createContext, useContext, useState } from "react";

// 1. Create Context
const MediaContext = createContext();

// 2. Create Provider (this holds the data)
export const MediaProvider = ({ children }) => {
  const [stream, setStream] = useState(null);

  return (
    <MediaContext.Provider value={{ stream, setStream }}>
      {children}
    </MediaContext.Provider>
  );
};

// 3. Custom hook (easy access)
export const useMedia = () => useContext(MediaContext);