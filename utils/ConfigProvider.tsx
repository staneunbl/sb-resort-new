"use client";

import { useGlobalStore } from "@/store/useGlobalStore";
import { Config } from "@/types";
import { Loader2 } from "lucide-react";
import { createContext,  useContext, useEffect, useState } from "react";


const ConfigContext = createContext<Config | null>(null)


export const useConfig = () => {
    const context = useContext(ConfigContext)
    console.log("useConfig()", context)
    if(context === null) {
        throw new Error("useConfig must be used within a ConfigProvider");
    }
    return context
} 

export const ConfigProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const { getConfigQuery } = useGlobalStore();
    const { data, isLoading, error } = getConfigQuery()
    const [config, setConfig] = useState<Config | null>(null);

    useEffect(() => {
        console.log("ConfigProvider()", data)
        if (data) {
            setConfig(data);
        }
    }, [data]);

    if(isLoading || config === null) return (
        <div className="w-full h-screen flex flex-col items-center justify-center">
            <Loader2 className="animate-spin" />
            <p className="text-black/[.5]">Loading...</p>
        </div>
    )

    if (error) {
        console.error("Config loading error:", error);
        return null;
    }
    
    return (
        <ConfigContext.Provider value={config}>
            {children}
        </ConfigContext.Provider>
    )
}