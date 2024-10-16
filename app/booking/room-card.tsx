import { formatCurrencyJP, truncate } from "@/utils/Helpers"
import { set } from "date-fns"
import { BabyIcon, BedDoubleIcon, CircleUserRoundIcon, Loader2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"
import parse from "html-react-parser"

type RoomCardProps = {
    roomTitle: string,
    bedType: string,
    adultCount: string,
    childCount: string,
    roomDesc: string,
    price: string,
    availRooms?: number,
    onClick: () => void,
    selectedType: string,
    disabled: boolean,
    tabindex: number,
    images?: string[]
}

export function RoomCard({tabindex ,roomTitle, bedType, adultCount, childCount, roomDesc , price, onClick, selectedType, disabled, availRooms, images}: RoomCardProps) {
    return (
        <div 
            tabIndex={tabindex} 
            className={`w-[80%] sm:w-[350px] md:w-[450px] lg:w-[400px] rounded-md drop-shadow-xl mt-5 flex-col transition group/card hover:cursor-pointer ${selectedType == roomTitle ? 'bg-cstm-secondary' : 'bg-white'} `} 
            onClick={onClick}
            onKeyDown={(e) => e.key === 'Enter'  && onClick()}
        >
            <div className="relative h-[200px]">
                {availRooms && availRooms < 5 ? (
                    <p className="absolute z-10 top-3 left-3 p-3 text-white rounded-sm bg-cstm-secondary">{availRooms} {availRooms > 1 ? "rooms" : "room"} left!</p>
                ): (
                    null
                )}
                {images ? (
                    <Image className="rounded-t-md object-cover object-center group-hover/card:object-right  transition-all" src={images[0]} alt="Beach" fill />
                ): (
                    <Image className="rounded-t-md" src={`https://placehold.co/400x200/png`} alt="Beach" width={400} height={100} />
                )}
            </div>
            <div className={`flex flex-col gap-4 p-4 group-hover/card:translate-x-2 group-focus/card:translate-x-2 transition justify-between`}>
                <div className="flex flex-col gap-4">
                    <p className={`text-2xl font-bold text-cstm-secondary transition ${selectedType == roomTitle && 'text-white'} `}>{roomTitle}</p>
                    <div className="flex items-start gap-4 transition flex-col sm:flex-row sm:justify-start sm:items-center flex-wrap">
                        <div className={`flex gap-2 items-center text-sm ${selectedType == roomTitle ? 'text-cstm-primary' : ''}`}>
                            <BedDoubleIcon size={12} className="transition"/>
                            <p className="transition">{bedType} </p>
                        </div>
                        <div className={`flex gap-2 items-center text-sm ${selectedType == roomTitle ? 'text-cstm-primary' : ''}`}>
                            <CircleUserRoundIcon size={12} className="transition"/>
                            <p className="transition">{parseInt(adultCount) > 1 ? `${adultCount} Adults` : `${adultCount} Adult`} </p>
                        </div>
                        <div className={`flex gap-2 items-center text-sm ${selectedType == roomTitle ? 'text-cstm-primary' : ''}`}>
                            <BabyIcon size={12} className="transition"/>
                            <p className="transition max-h-[100px   ]">{parseInt(childCount) > 1 ? `${childCount} Children` : `${childCount} Child`}</p>
                        </div>
                    </div>
                    {/* <div>
                        {disabled && <p className="text-red-500 font-bold">Currently unavailable</p>}
                        {!disabled && <p className={`font-bold ${selectedType == roomTitle ? 'text-white' : 'text-cstm-secondary'}`}>{availRooms || 0} {availRooms! > 1 ? "Rooms" : "Room"} Available</p>}
                    </div> */}
                    <p className={`h-[100px] md:h-[64px] ${selectedType == roomTitle ? 'text-white/[.70]' : 'text-black/[.70]'}`}>{parse(truncate(roomDesc, 100))}</p>
                </div>
                <div className={`flex justify-end ${selectedType == roomTitle ? 'text-white/[.70]' : 'text-black/[.70]'}`}>
                    <div className={`flex-col ${selectedType == roomTitle ? 'text-white/[.70]' : 'text-black/[.70]'}`}>
                        <p className="text-uppercase italic text-end">Starts at</p>
                        <p>
                            {price ? (
                                <>
                                    <span className={`text-xl font-bold text-cstm-secondary ${selectedType == roomTitle && 'text-white'} `}>
                                        ¥{formatCurrencyJP(parseInt(price)) || <Loader2 size={20} className="animate-spin" />}
                                    </span> / night
                                </>
                            ): (
                                <Loader2 size={20} className="animate-spin" />
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )   
}