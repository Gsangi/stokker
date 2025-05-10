"use client"

import React from "react";

const GlobalContext = React.createContext(undefined);

export default function GlobalProvider({children}){
    //Add states
    return <GlobalContext.Provider value={{}}>
        {children}
    </GlobalContext.Provider>
}

export const useGlobalContext = () => {
    const context = React.useContext(GlobalContext);

    if(!context) {
        throw new Error("GlobalProvider not found")
    }

    return context;
}