import { computeInitialBooking, formatCurrencyJP, truncate } from "@/utils/Helpers"
import { format, set } from "date-fns"
import { BabyIcon, BedDoubleIcon, CalendarIcon, CircleUserRoundIcon, DoorClosedIcon, Maximize2Icon } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import parse from "html-react-parser"
import { useGlobalStore } from "@/store/useGlobalStore"
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@radix-ui/react-tabs"
import { useBookingStore } from "@/store/useBookingStore"
import { findWeekdaysInRange } from "@/utils/Helpers"
import { LightboxModal } from "./LightboxModal"

type RoomRatesCardProps = {
    roomType: RoomType,
    roomRate: RoomRate,
    roomAmenities: RoomAmenityResponse[]
    roomRateOrig?: RoomRate 
}

export function RoomRatesCard({roomType, roomRate, roomAmenities, roomRateOrig}: RoomRatesCardProps) {

    const imgSamples = [
        "https://uaukaqfnisyvjiondsrq.supabase.co/storage/v1/object/public/images/Executive-One-bedroom-3-1-scaled-qfol4gua9qd8j2eesgz4t8cambx9tpet67hjbuayfg.jpg",
        "https://uaukaqfnisyvjiondsrq.supabase.co/storage/v1/object/public/images/andrew-neel-B4rEJ09-Puo-unsplash.jpg",
        "https://uaukaqfnisyvjiondsrq.supabase.co/storage/v1/object/public/images/christopher-jolly-GqbU78bdJFM-unsplash.jpg",
        "https://uaukaqfnisyvjiondsrq.supabase.co/storage/v1/object/public/images/deluxe_harbour_web.jpg"
    ]

    console.log(roomAmenities)
    const {
        checkInRange,
        adultGuests,
        setAdultGuests,
        childGuests,
        setChildGuests,
        setExtraAdult,
        setExtraChild,
        initialBill,
        setInitialBill,
        promoCode,
        setLightboxModalState
    } = useBookingStore()

    const isWeekendDate = (new Date().getDay() == 0 || new Date().getDay() == 6 ? true: false)

    const {
        weekdays,
        weekends
    } = findWeekdaysInRange(checkInRange.from, checkInRange.to)

    const [isWeekend, setIsWeekend] = useState(isWeekendDate);

    const handleAdultChange = (e: Event) => {
        const value = Number((e.target as HTMLInputElement).value);
        setAdultGuests(value);
        if(adultGuests > roomType.MaxAdult) {
            setExtraAdult(adultGuests - roomType.MaxAdult)
        }
    }

    const handleChildChange = (e: Event) => {
        const value = Number((e.target as HTMLInputElement).value);
        setChildGuests(value);
        if(childGuests > roomType.MaxChild) {
            setExtraChild(childGuests - roomType.MaxChild)
        }
    }

    useEffect(() => {
        setInitialBill(computeInitialBooking(
            roomRate, 
            weekends, 
            weekdays, 
            (adultGuests - roomType.MaxAdult > 0 ? adultGuests - roomType.MaxAdult : 0),
            (childGuests - roomType.MaxChild > 0 ? childGuests - roomType.MaxChild : 0)
        ))
    }, [adultGuests, childGuests])

    return (
        <>
            <LightboxModal images={roomType.Images} roomType={roomType}></LightboxModal>
            <div className={`w-full rounded-md drop-shadow-xl mt-5 p-5 transition group/card bg-white border-2 border-gray-200`}>
                <div>
                    <p className="text-2xl font-bold text-cstm-secondary">{roomType.Name} {promoCode && <span className="text-cstm-primary">({promoCode})</span>} </p>
                    {/* <div className="mt-4 flex items-start gap-4 transition flex-col sm:flex-row sm:justify-start sm:items-center">
                        <div className={`flex gap-2 items-center text-cstm-primary`}>
                            <BedDoubleIcon size={16} className="transition"/>
                            <p className="transition">{roomType.BedTypes.TypeName} </p>
                        </div>
                        <div className={`flex gap-2 items-center text-cstm-primary`}>
                            <CircleUserRoundIcon size={16} className="transition"/>
                            <p className="transition">{roomType.MaxAdult > 1 ? `${roomType.MaxAdult} Adults` : `${roomType.MaxAdult} Adult`} </p>
                        </div>
                        <div className={`flex gap-2 items-center text-cstm-primary`}>
                            <BabyIcon size={16} className="transition"/>
                            <p className="transition max-h-[100px]">{roomType.MaxChild > 1 ? `${roomType.MaxChild} Children` : `${roomType.MaxChild} Child`}</p>
                        </div>
                    </div> */}
                </div>
                <div className="flex flex-col gap-4 mt-5 md:flex-row">
                    <div className="relative flex flex-col gap-4 w-full md:w-3/5">
                        
                        <div className="relative w-full h-[200px] sm:h-[400px] cursor-pointer group/image">
                            <div className="absolute top-4 right-4 bg-black/20 text-white p-3 rounded-full z-10 transition-all hover:text-cstm-primary">
                                <Maximize2Icon className="size-4 transition-all group-hover/image:size-6" />
                            </div>
                            <Image 
                                className="rounded-md object-cover object-center transition-all" 
                                src={roomType.Images[0]} 
                                sizes="100vw" 
                                alt="Beach" 
                                fill 
                                onClick={() => setLightboxModalState(true)} />
                            {/* <Lightbox images={roomType.Images} className="w-full h-full" componentStyles={{thumbnailImage: 'rounded-lg'}}/> */}
                        </div>

                        <div className="mt-5">
                            <p className="text-xl font-bold text-cstm-secondary">Description</p>
                            <div className="mt-4 flex items-start gap-4 transition flex-col sm:flex-row sm:justify-start sm:items-center">
                                <div className={`flex gap-2 items-center text-cstm-primary`}>
                                    <BedDoubleIcon size={16} className="transition"/>
                                    <p className="transition">{roomType.BedTypes.TypeName} </p>
                                </div>
                                <div className={`flex gap-2 items-center text-cstm-primary`}>
                                    <CircleUserRoundIcon size={16} className="transition"/>
                                    <p className="transition">{roomType.MaxAdult > 1 ? `${roomType.MaxAdult} Adults` : `${roomType.MaxAdult} Adult`} </p>
                                </div>
                                <div className={`flex gap-2 items-center text-cstm-primary`}>
                                    <BabyIcon size={16} className="transition"/>
                                    <p className="transition max-h-[100px]">{roomType.MaxChild > 1 ? `${roomType.MaxChild} Children` : `${roomType.MaxChild} Child`}</p>
                                </div>
                            </div>
                            <p className="text-black/[.70] mt-4">{parse(roomType.Description)}</p>

                            {
                                roomAmenities.length > 0 && (
                                    <>
                                        <p className="font-bold text-xl text-cstm-secondary mt-5">Amenities</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2  gap-4 list-inside mt-4">
                                                {roomAmenities.map((amenity: any) => (
                                                <p className="text-black/[.70]">• {amenity.Amenities.Description}</p>
                                                ))}
                                        </div>
                                    </>
                                )
                            }
                        </div>

                        <div className="mt-5">
                            <p className="text-xl font-bold text-cstm-secondary">{promoCode ? "Promo Rates": "Rates"}</p>
                            {
                                promoCode ? (
                                    <div className="flex gap-4 flex-wrap flex-row sm:gap-8 ms-4 mt-4">
                                                <div className="flex flex-col">
                                                    <p className="text-black/[.6]">Base Rate</p>
                                                    <p><span className="font-bold text-xl text-cstm-secondary">¥{formatCurrencyJP(roomRate.BaseRoomRate)}</span> per night</p>
                                                </div>

                                                <div className="flex flex-col">
                                                    <p className="text-black/[.6]">Extra Adult</p>
                                                    <p><span className="font-bold text-xl text-cstm-secondary">¥{formatCurrencyJP(roomRate.ExtraAdultRate)}</span> per night</p>
                                                </div>

                                                <div className="flex flex-col">
                                                    <p className="text-black/[.6]">Extra Children</p>
                                                    <p><span className="font-bold text-xl text-cstm-secondary">¥{formatCurrencyJP(roomRate.ExtraChildRate)}</span> per night</p>
                                                </div>
                                    </div>
                                ) : (
                                    <Tabs defaultValue={ new Date().getDay() == 0 || new Date().getDay() == 6 ? "weekends" : "weekdays" } className="mt-3">
                                        <TabsList className="flex gap-2 mb-3">
                                            <TabsTrigger value="weekends" className={`px-3 py-2 rounded-3xl md:px-4 md:w-auto ${isWeekend ? "bg-cstm-secondary text-white" : "text-cstm-secondary"}`} onClick={() => setIsWeekend(true)}>Weekends</TabsTrigger>
                                            <TabsTrigger value="weekdays" className={`px-3 py-2 rounded-3xl md:px-4 md:w-auto ${!isWeekend ? "bg-cstm-secondary text-white" : "text-cstm-secondary"}`} onClick={() => setIsWeekend(false)}>Weekdays</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="weekends">
                                            <div className="flex gap-4 flex-wrap flex-row sm:gap-8 ms-4">
                                                <div className="flex flex-col">
                                                    <p className="text-black/[.6]">Base Rate</p>
                                                        {
                                                            !roomRateOrig ? (
                                                                <p><span className="font-bold text-xl text-cstm-secondary">¥{formatCurrencyJP(roomRate.BaseRoomRate)}</span> per night</p>
                                                            ):(
                                                                <>
                                                                    <p><span className="font-bold text-cstm-secondary/[.50]">¥{formatCurrencyJP(roomRateOrig.BaseRoomRate)}</span></p>
                                                                    <p><span className="font-bold text-xl text-cstm-secondary">¥{formatCurrencyJP(roomRate.WeekendRoomRate)}</span> per night</p>
                                                                </>
                                                            )
                                                        }
                                                </div>

                                                <div className="flex flex-col">
                                                    <p className="text-black/[.6]">Extra Adult</p>
                                                    <p><span className="font-bold text-xl text-cstm-secondary">¥{formatCurrencyJP(roomRate.WeekendExtraAdultRate)}</span> per night</p>
                                                </div>

                                                <div className="flex flex-col">
                                                    <p className="text-black/[.6]">Extra Children</p>
                                                    <p><span className="font-bold text-xl text-cstm-secondary">¥{formatCurrencyJP(roomRate.WeekendExtraChildRate)}</span> per night</p>
                                                </div>
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="weekdays" >
                                            <div className="flex gap-4 flex-wrap flex-row sm:gap-8 ms-4">
                                                <div className="flex flex-col">
                                                    <p className="text-black/[.6]">Base Rate</p>
                                                    <p><span className="font-bold text-xl text-cstm-secondary">¥{formatCurrencyJP(roomRate.BaseRoomRate)}</span> per night</p>
                                                </div>

                                                <div className="flex flex-col">
                                                    <p className="text-black/[.6]">Extra Adult</p>
                                                    <p><span className="font-bold text-xl text-cstm-secondary">¥{formatCurrencyJP(roomRate.ExtraAdultRate)}</span> per night</p>
                                                </div>

                                                <div className="flex flex-col">
                                                    <p className="text-black/[.6]">Extra Children</p>
                                                    <p><span className="font-bold text-xl text-cstm-secondary">¥{formatCurrencyJP(roomRate.ExtraChildRate)}</span> per night</p>
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                )
                            }
                        </div>
                        
                        <div className="mt-5">
                            <p className="text-xl font-bold text-cstm-secondary">Number of Guests</p>
                            <div className="flex-wrap gap-8 flex md:gap-16 mt-3">
                                <div>
                                    <p className="text-md font-bold">Adults</p>
                                    <div className="flex gap-2">
                                        <button className="p-3 bg-cstm-secondary rounded-md text-white w-10" onClick={() => setAdultGuests(adultGuests > 0? adultGuests - 1 : 0)}>-</button>
                                        <input type="number" className="text-center font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-3"  value={adultGuests} min={1} max={5} onChange={(e) => setAdultGuests(parseInt(e.target.value))} />
                                        <button className="p-3 bg-cstm-secondary rounded-md text-white w-10" onClick={() => setAdultGuests(adultGuests + 1)}>+</button>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-md font-bold">Children</p>
                                    <div className="flex gap-2">
                                        <button className="p-3 bg-cstm-secondary rounded-md text-white w-10" onClick={() => setChildGuests(childGuests > 0 ? childGuests - 1 : 0)}>-</button>
                                        <input type="number" className="text-center font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-3" value={childGuests} min={1} max={5} onChange={(e) => setChildGuests(parseInt(e.target.value))} /> 
                                        <button className="p-3 bg-cstm-secondary rounded-md text-white w-10" onClick={() => setChildGuests(childGuests + 1)}>+</button>
                                    </div>
                                </div>
                            </div>
                            <p className="text-black/[.70] italic mt-4">Guests that exceed the capacity of the room will be charged accordingly (per night).</p>
                        </div>
                        {/* <div>
                            <p className="text-xl font-bold text-cstm-secondary">Add-Ons</p>
                        </div> */}
                    </div>
                    <div className="w-full mt-4 md:w-2/5 md:mt-0">
                        <div className="p-5 bg-cstm-secondary rounded-xl w-full transition-all ">
                            <div className="flex flex-col gap-4">
                                <p className="text-xl font-bold text-white">Booking Details</p>
                                <div className="flex flex-wrap gap-8">
                                    <div>
                                        <div className="flex gap-4 items-center">
                                            <DoorClosedIcon color="white"/>
                                            <p className="text-white font-bold">Room Type</p>
                                        </div>
                                        <p className="ms-10 text-white/[.70]">{roomType.Name}</p>
                                    </div>
                                    <div>
                                        <div className="flex gap-4 items-center">
                                            <CalendarIcon color="white"/>
                                            <p className="text-white font-bold">Booked Dates</p>   
                                        </div>
                                        <p className="ms-10 text-white/[.70]">{format(checkInRange.from, "MM/dd/yyyy")} - {format(checkInRange.to, "MM/dd/yyyy")}</p>
                                        <p className="mt-2 text-white/[.70] ms-10 italic md:mt-0">{weekdays > 0 && weekdays + " Weekday/s" } {weekends > 0 && " | " + weekends + " Weekend/s"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-white font-bold ">Breakdown</p>
                                <div className="">
                                    <div className="flex flex-col gap-2 md:p-3">
                                        {
                                            promoCode && (
                                                <div className="flex justify-between">
                                                    <p className="text-cstm-primary font-bold">Promo Code ({promoCode || "None"})</p>
                                                </div>
                                            )
                                        }
                                        {weekdays > 0 && (
                                            <div className="flex justify-between">
                                                <p className="text-white/[.70]">Weekdays x {weekdays}</p>
                                                <p className="text-white">¥{formatCurrencyJP(roomRate.BaseRoomRate * weekdays)}</p>
                                            </div>
                                        )}
                                        {weekends > 0 && (
                                            <div className="flex justify-between">
                                                <p className="text-white/[.70] ">Weekends x {weekends}</p>
                                                <p className="text-white">¥{formatCurrencyJP(roomRate.WeekendRoomRate * weekends)}</p>
                                            </div>
                                        )}
                                        {adultGuests - roomType.MaxAdult > 0 && (
                                            <>
                                                <div className="flex justify-between">
                                                    <div className="flex flex-col gap-2">
                                                        <p className="text-white/[.70]">Extra Adults x {adultGuests - roomType.MaxAdult}</p>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <p className="text-white text-right ">¥{formatCurrencyJP(
                                                            ((adultGuests - roomType.MaxAdult) * roomRate.ExtraAdultRate * weekdays) +
                                                            ((adultGuests - roomType.MaxAdult) * roomRate.WeekendExtraAdultRate * weekends)
                                                        )}</p>
                                                    </div>
                                                </div>
                                                {weekdays > 0 && (
                                                    <div className="flex justify-between">
                                                        <p className="ms-4 text-white/[.50] italic">{weekdays} Weekdays</p>
                                                        <p className="ms-4 text-white/[.50] italic">¥{formatCurrencyJP((adultGuests - roomType.MaxAdult) * roomRate.ExtraAdultRate * weekdays)}</p>
                                                    </div>
                                                )}
                                                {weekends > 0 && (
                                                    <div className="flex justify-between">
                                                        <p className="ms-4 text-white/[.50] italic">{weekends} Weekends</p>
                                                        <p className="ms-4 text-white/[.50] italic">¥{formatCurrencyJP((adultGuests - roomType.MaxAdult) * roomRate.WeekendExtraAdultRate * weekends)}</p>
                                                    </div>
                                                )}
                                            </>
                                        ) }
                                        {(childGuests - roomType.MaxChild) > 0 && (
                                            <>
                                                <div className="flex justify-between">
                                                    <div className="flex flex-col gap-2">
                                                        <p className="text-white/[.70]">Extra Children x {childGuests - roomType.MaxChild}</p>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                    <p className="text-white text-right">¥{formatCurrencyJP(
                                                            ((childGuests - roomType.MaxChild) * roomRate.ExtraChildRate * weekdays) +
                                                            ((childGuests - roomType.MaxChild) * roomRate.WeekendExtraChildRate * weekends)
                                                        )}</p>
                                                    </div>
                                                </div>
                                                {weekdays > 0 && (
                                                    <div className="flex justify-between">
                                                        <p className="ms-4 text-white/[.50] italic">{weekdays} Weekdays</p>
                                                        <p className="ms-4 text-white/[.50] italic">¥{formatCurrencyJP((childGuests - roomType.MaxChild) * roomRate.ExtraChildRate * weekdays)}</p>
                                                    </div>
                                                )}
                                                {weekends > 0 && (
                                                    <div className="flex justify-between">
                                                        <p className="ms-4 text-white/[.50] italic">{weekends} Weekends</p>
                                                        <p className="ms-4 text-white/[.50] italic">¥{formatCurrencyJP((childGuests - roomType.MaxChild) * roomRate.WeekendExtraChildRate * weekends)}</p>
                                                    </div>
                                                )}
                                            </>
                                        ) }
                                    </div>
                                </div>
                            </div>
                            <hr className="my-4" />

                            <div className="flex flex-col mt-4 items-end justify-center sm:justify-end sm:items-center sm:gap-4 sm:flex-row">
                                <p className="text-white/[.70]">TOTAL</p>
                                <p className="text-white text-2xl font-bold">
                                ¥{formatCurrencyJP(computeInitialBooking(
                                        roomRate, 
                                        weekends, 
                                        weekdays, 
                                        (adultGuests - roomType.MaxAdult > 0 ? adultGuests - roomType.MaxAdult : 0),
                                        (childGuests - roomType.MaxChild > 0 ? childGuests - roomType.MaxChild : 0)
                                    ))
                                }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )   
}