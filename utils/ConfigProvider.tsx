"use client";

import { useGlobalStore } from "@/store/useGlobalStore";
import { Config } from "@/types";
import { Loader2 } from "lucide-react";
import { createContext,  useContext } from "react";


const ConfigContext = createContext<Config | undefined>(undefined)


export const useConfig = () => {
    const context = useContext(ConfigContext)
    if(!context) {
        throw new Error("No data")
    }
    return context
} 

export const ConfigProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const { getConfigQuery } = useGlobalStore();
    const { data } = getConfigQuery()

    if(!data) return (
        <div className="w-full h-screen flex flex-col items-center justify-center">
            <Loader2 className="animate-spin" />
            <p className="text-black/[.5]">Loading...</p>
        </div>
    )
    
    return (
        <ConfigContext.Provider value={data}>
            {children}
        </ConfigContext.Provider>
    )
}