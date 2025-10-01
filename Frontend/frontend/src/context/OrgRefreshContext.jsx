import { createContext, useContext, useState, useCallback } from "react";

const OrgRefreshContext = createContext(null);

const OrgRefreshProvider = ({ children }) => {

    const [globalVersion, setGlobalVersion] = useState(0);


    const bumpGlobalVersion = useCallback(() => {
        setGlobalVersion((v) => v + 1);
    }, []);

    return (
        <OrgRefreshContext.Provider value={{ globalVersion, bumpGlobalVersion }}>
            {children}
        </OrgRefreshContext.Provider>
    );
};


const useOrgGlobalVersion = () => {
    const { globalVersion } = useContext(OrgRefreshContext);
    return globalVersion;
};


const useBumpGlobalVersion = () => {
    const { bumpGlobalVersion } = useContext(OrgRefreshContext);
    return bumpGlobalVersion;
};


export { OrgRefreshProvider, useOrgGlobalVersion, useBumpGlobalVersion };