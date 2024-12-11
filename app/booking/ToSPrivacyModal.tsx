"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import parse from "html-react-parser"
import { useBookingStore } from "@/store/useBookingStore"
import { useGlobalStore } from "@/store/useGlobalStore"
import { useConfig } from "@/utils/ConfigProvider"

  export function ToSPrivacyModal() {

    const {
        ToSPrivacyModalState,
        setToSPrivacyModalState
    } = useBookingStore()

    const config = useConfig()

    return (
        <Dialog
        open={ToSPrivacyModalState}
        onOpenChange={setToSPrivacyModalState}
        >
            <DialogContent className="w-[700px]">
                <DialogHeader>
                    <DialogTitle>Terms of Service and Privacy Policy</DialogTitle>
                    <DialogDescription>
                        Please take the time to read both the Terms of Service and the Rules and Policies before providing your consent.
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="tos">
                    <TabsList>
                        <TabsTrigger value="tos">Terms of Service</TabsTrigger>
                        <TabsTrigger value="privacy">Rules and Policies</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tos" className="max-h-[400px] overflow-auto mt-4">
                        <div className="flex flex-col gap-4">
                            {/* <p>By using our services and making a reservation, you acknowledge that you have read and agree to our Terms of Service. Please review the following details carefully before providing your consent.</p>
                        
                            <p className="font-bold text-lg">Summary of the Terms and Service</p>
                            <div className="flex flex-col gap-4">
                                <div>
                                        <p className="font-bold">1. Agreement to Terms</p>
                                        <p className="ms-4">By accessing our services, you confirm that you have reviewed, understood, and consent to our Terms of Service.</p>
                                </div>
                                <div>
                                        <p className="font-bold">2. Booking Reservations</p>
                                        <p className="ms-4">All bookings are contingent upon availability and confirmation. Please ensure that the information you provide is accurate.</p>
                                </div>
                                <div>
                                        <p className="font-bold">3. Payment Obligations</p>
                                        <p className="ms-4">Payment must be completed at the time of booking. You will be responsible for all charges incurred during your stay.
                                        </p>
                                </div>
                                <div>
                                        <p className="font-bold">4. Cancellation Terms</p>
                                        <p className="ms-4">Cancellations must comply with our specified policies to qualify for a refund.</p>
                                </div>
                                <div>
                                        <p className="font-bold">5. Liabilities and Responsibilities</p>
                                        <p className="ms-4">You agree to accept responsibility for any damages or losses that may occur during your stay.</p>
                                </div>
                                <div>
                                        <p className="font-bold">6. Privacy Practices</p>
                                        <p className="ms-4">We will handle your personal information in accordance with our Privacy Policy.</p>
                                </div>
                                <div>
                                        <p className="font-bold">7. Changes to Terms</p>
                                        <p className="ms-4">We reserve the right to update these terms as necessary. Any modifications will be posted on our website, and continued use of our services indicates acceptance of the new terms.</p>
                                </div>
                            </div> */}

                            {parse(config?.TermsOfService)}
                        </div>
                    </TabsContent>
                    <TabsContent value="privacy" className="max-h-[400px] overflow-auto mt-4">
                        <div className="flex flex-col gap-4">
                            {/* <p>To ensure a safe and enjoyable experience for all our guests, we kindly ask you to review and sign the following rules and policies.</p>
                        
                            <div className="flex flex-col gap-4 [&>li]:ms-4">
                                <div>
                                        <p className="font-bold">1. Check In and Check Out Periods</p>
                                        <ul className="ms-10 list-disc">
                                            <li>Clients may check-in to their assigned rooms any time after 2:00PM.</li>
                                            <li>Clients must check-out of their assigned rooms before 12:00NN.</li>
                                        </ul>
                                </div>
                                <div>
                                        <p className="font-bold">2. General Conduct</p>
                                        <ul className="ms-10 list-disc">
                                            <li>We expect all guests to interact respectfully with staff and fellow visitors.</li>
                                            <li>Any behavior deemed disruptive or inappropriate may result in action being taken.</li>
                                        </ul>
                                </div>
                                <div>
                                        <p className="font-bold">3. Check-In and Check-Out Times</p>
                                        <ul className="ms-10 list-disc">
                                            <li>Check-in time is available at 2:00PM.</li>
                                            <li>Check-out must be completed by 12:00NN.</li>
                                            <li>Late check-out may result in additional charges.</li>
                                        </ul>
                                </div>
                                <div>
                                        <p className="font-bold">4. Payment Information</p>
                                        <ul className="ms-10 list-disc">
                                            <li>All payments must be made in full upon check-in.</li>
                                            <li>Accepted payment methods include list methods.</li>
                                        </ul>
                                </div>
                                <div>
                                        <p className="font-bold">5. Cancellation Policy</p>
                                        <ul className="ms-10 list-disc">
                                            <li>To receive a full refund, cancellations must be made [number of days] prior to arrival.</li>
                                            <li>Guests who do not show will be charged the total amount. 
                                            </li>
                                        </ul>
                                </div>
                                <div>
                                        <p className="font-bold">6. Safety and Security Measures</p>
                                        <ul className="ms-10 list-disc">
                                            <li>Please ensure that doors are closed when not in use.</li>
                                            <li>Report any suspicious behavior to our staff immediately.
                                            </li>
                                        </ul>
                                </div>
                                <div>
                                        <p className="font-bold">7. Responsibility for Damages</p>
                                        <ul className="ms-10 list-disc">
                                            <li>Guests will be held accountable for any damages that occur during their stay.</li>
                                            <li>A security deposit may be requested upon check-in. 
                                            </li>
                                        </ul>
                                </div>
                                <div>
                                        <p className="font-bold">8. Smoking and Alcohol Policy</p>
                                        <ul className="ms-10 list-disc">
                                            <li>Smoking is strictly prohibited in all indoor areas.</li>
                                            <li>Consumption of alcohol is limited to designated zones.
                                            </li>
                                        </ul>
                                </div>
                                <div>
                                        <p className="font-bold">9. Pets</p>
                                        <ul className="ms-10 list-disc">
                                            <li>Pets are [allowed/not allowed]. If permitted, please adhere to our specific pet guidelines.</li>
                                        </ul>
                                </div>
                                <div>
                                        <p className="font-bold">10. Use of Additional Amenities</p>
                                        <ul className="ms-10 list-disc">
                                            <li>Guests have access to amenities such as [list amenities, e.g., pool, gym, lounge, etc.] during their designated hours.</li>
                                            <li>Each amenity has specific rules that must be followed, including [mention any relevant rules, like age restrictions, guest limits, or reservation requirements]. 
                                            </li>
                                            <li>All amenities are used at your own risk, we appreciate your help in keeping these clean and welcoming.
                                            </li>
                                            <li>Certain amenities or services may incur extra charges, which will be outlined at check-in. 
                                            </li>
                                        </ul>
                                </div>
                            </div> */}

                            {parse(config?.PrivacyPolicy)}
                        </div>
                    </TabsContent>
                </Tabs>

            </DialogContent>
        </Dialog>
    )
  }      