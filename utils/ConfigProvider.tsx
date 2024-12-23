"use client";

import { transformConfig } from "@/app/ServerAction/config.action";
import { useGlobalStore } from "@/store/useGlobalStore";
import { Config } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { createContext,  useContext, useEffect, useState } from "react";


const ConfigContext = createContext<Config | null>(null)

const starterConfig = {
    CompanyName: "",
    CompanyLogo: "",
    CompanyContact: "",
    CompanyAddress: "",
    CompanyEmail: "",
    FacebookUrl: "",
    InstagramUrl: "",
    TiktokUrl: "",
    YoutubeUrl: "",
    XUrl: "",
    TermsOfService: "",
    PrivacyPolicy: "",
    PaymentInstructions: "",
    CookieMessage: ""
}


export const useConfig = () => {
    const context = useContext(ConfigContext)
    //console.log("useConfig()", context)
    if(context === null) {
        throw new Error("useConfig must be used within a ConfigProvider");
    }
    return context
} 

export const ConfigProvider: React.FC<{children: React.ReactNode}> = ({children}) => {

    const { data, isLoading, error } = useQuery({
      queryKey: ["GetConfig"],
      queryFn: async () => {
        try {
          const result = await transformConfig();
          return result
        }
        catch (error) {
          console.error("Config query error:", error);
          throw error;
        }
      },
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: 1
    })

    const [config, setConfig] = useState<Config>();

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
        <ConfigContext.Provider value={config || starterConfig}>
            {children}
        </ConfigContext.Provider>
    )
}