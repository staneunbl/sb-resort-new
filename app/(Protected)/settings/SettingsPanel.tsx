'use client'

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useGlobalStore } from "@/store/useGlobalStore";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SiFacebook, SiInstagram, SiYoutube, SiX, SiTiktok } from '@icons-pack/react-simple-icons';
import { useMutation } from "@tanstack/react-query";
import { updateConfig } from "@/app/ServerAction/config.action";
import { toast } from "sonner";
import { useState } from "react";
import { ImageIcon, X } from "lucide-react";
import { uploadImage } from "@/app/ServerAction/rooms.action";
import { createClient } from "@supabase/supabase-js";
import  sendEmail  from "@/app/ServerAction/email.action";
import { emailStringConfirmBooking } from "@/utils/Helpers";
import { addOnlineReservation } from "@/app/ServerAction/reservations.action";

export default function SettingsPanel() {

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string);
    async function uploadImage(file: File) {
        let path =  `${file.name}`
        
        const { data, error } = await supabase.storage
          .from("images")
          .upload(path, file, {
            cacheControl: "3600",
            upsert: false
          })
    
        if (error) {
          console.log(error)
        }
    
        const { data: publicUrl } = await supabase.storage
          .from("images")
          .getPublicUrl(path)
      
        return publicUrl
      }

    const { getConfigQuery } = useGlobalStore()

    const { data: configData, isLoading: configLoading, error: configErr, refetch: configRefetch } = getConfigQuery();

    const formSchema = z.object({
        companyName: z.string().min(1, {message: "Please enter a company name."}),
        companyLogo: z.string().min(1, {message: "Please enter a company logo."}),
        companyAddress: z.string().min(1, {message: "Please enter a company address."}),
        companyContact: z.coerce.string().min(6, {message: "Number must contain at least 6 numbers."}).max(11, {message: "Number must contain at most 11 numbers."}),
        companyEmail: z.string().email({message: "Please enter a valid email."}),
        facebookUrl: z.string().url({message: "Please enter a valid URL."}).optional(),
        instagramUrl: z.string().url({message: "Please enter a valid URL."}).optional(),
        tiktokUrl: z.string().url({message: "Please enter a valid URL."}).optional(),
        youtubeUrl: z.string().url({message: "Please enter a valid URL."}).optional(),
        xUrl: z.string().url({message: "Please enter a valid URL."}).optional(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                companyName: '',
                companyLogo: '',
                companyAddress: '',
                companyContact: undefined,
                companyEmail: undefined,
                facebookUrl: undefined,
                instagramUrl: undefined,
                tiktokUrl: undefined,
                youtubeUrl: undefined,
                xUrl: undefined
            },
            values: {
                companyName: configData?.CompanyName,
                companyContact: configData?.CompanyContact,
                companyAddress: configData?.CompanyAddress,
                companyEmail: configData?.CompanyEmail ,
                companyLogo: configData?.CompanyLogo || undefined,
                facebookUrl: configData?.FacebookUrl || undefined,
                instagramUrl: configData?.InstagramUrl || undefined,
                tiktokUrl: configData?.TiktokUrl || undefined,
                youtubeUrl: configData?.YoutubeUrl || undefined,
                xUrl: configData?.XUrl || undefined
            }
    })

    const editConfigMutation = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            const res = await updateConfig(
                values.companyName, 
                values.companyLogo,
                values.companyContact,
                values.companyEmail,
                values.companyAddress,
                values.facebookUrl || "",
                values.instagramUrl || "",
                values.tiktokUrl || "",
                values.youtubeUrl || "",
                values.xUrl || ""
            )
            console.log(res)
            if (!res.success) throw new Error
            return res
        },
        onSuccess: () => {
            console.log("success")
            toast.success("Success!", {
                description: "Details have been saved."
            })
        },
        onError: (error) => {
            console.log(error)
            toast.error("Oops!", {
                description: error.message
            })
        }
    })
    
    async function onSubmit(values: z.infer<typeof formSchema>) {

        const publicUrl = await uploadImage(logoUpload as File)

        values.companyLogo = publicUrl?.publicUrl || ''

        console.log(values)
        editConfigMutation.mutate(values);
    }

    const [preview, setPreview] = useState(configData?.CompanyLogo || "");
    const [logoUpload, setLogoUpload] = useState({});

    const handleFileChange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
        if (!file.type.startsWith('image/')) {
            form.setError('companyLogo', {
            type: 'manual',
            message: 'Please upload an image file.'
            });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const url = URL.createObjectURL(file)
            form.setValue('companyLogo', url, { shouldValidate: true });
            setLogoUpload(file);
            setPreview(url);
        };
        reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        form.setValue('companyLogo', '', { shouldValidate: true });
        setPreview('');
    };

    const sendEmails = async () => {
        const data = await addOnlineReservation(
            "Wendell",
            "Ravago",
            new Date(),
            "wendell.ravago@linoflaptech.com",
            "1234567890",
            "UK",
            1,
            1,
            new Date(),
            new Date(),
            0,
            0,
            1,
            1,
            "",
            ""
        )
        console.log(data)
        sendEmail("wendell.ravago@linoflaptech.com", "Hello", emailStringConfirmBooking(configData))
    }

    return   (
        <>
            <Button onClick={() => sendEmails()}>Email</Button>
            <Form {...form}>
                <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex gap-4">
                        <Card className="shadow w-full">
                            <CardHeader className="flex rounded-t-md bg-cstm-primary p-3 pl-5 text-xl font-semibold text-white">
                                Company Details
                            </CardHeader>
                            <div className="flex w-full">
                                <div className="flex flex-col p-4 gap-4 w-full">
                                    <FormField
                                        control={form.control}
                                        name="companyLogo"
                                        render={({ field }) => (
                                            <FormItem className="space-y-4">
                                            <FormLabel>Company Logo</FormLabel>
                                            <div className="flex gap-4 items-start">
                                                <div className="flex-1">
                                                    <div className="relative w-32 h-32 border rounded-lg flex items-center justify-center overflow-hidden bg-muted">
                                                        {preview ? (
                                                            <>
                                                            <div className="absolute right-1 top-1 m-1">
                                                                <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={handleRemoveImage}
                                                                className="aspect-square rounded-full"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                            <img
                                                                src={preview}
                                                                alt="Company logo preview"
                                                                className="w-full h-full object-contain"
                                                            />
                                                            </>
                                                        ) : (
                                                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <FormControl>
                                                        <div className="flex flex-col gap-2 mt-2">
                                                        <Input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleFileChange}
                                                            className="cursor-pointer"
                                                        />
                                                        </div>
                                                    </FormControl>
                                                    
                                                </div>
                                                
                                            </div>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="companyName"
                                        render = {({field}) => (
                                            <FormItem className="w-full">
                                                <FormLabel>
                                                    Company Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="ABC Resort" {...field} />
                                                </FormControl>
                                                <FormMessage>

                                                </FormMessage>
                                            </FormItem>
                                        )}   
                                    >
                                    </FormField>

                                    <FormField
                                        control={form.control}
                                        name="companyAddress"
                                        render = {({field}) => (
                                            <FormItem className="w-full">
                                                <FormLabel>
                                                    Company Address
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="123 Resort St., City of Dreams, USA" {...field} />
                                                </FormControl>
                                                <FormMessage>

                                                </FormMessage>
                                            </FormItem>
                                        )}   
                                    >
                                    </FormField>

                                    <FormField
                                        name="companyContact"
                                        render = {({field}) => (
                                            <FormItem className="w-full">
                                                <FormLabel>
                                                    Company Contact Number
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="091234567" type="number" {...field} />
                                                </FormControl>
                                                <FormMessage>

                                                </FormMessage>
                                            </FormItem>
                                        )}   
                                    >
                                    </FormField>

                                    <FormField
                                        control={form.control}
                                        name="companyEmail"
                                        render = {({field}) => (
                                            <FormItem className="w-full">
                                                <FormLabel>
                                                    Company Email
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="email@company.com" {...field} />
                                                </FormControl>
                                                <FormMessage>

                                                </FormMessage>
                                            </FormItem>
                                        )}   
                                    >
                                    </FormField>
                                </div>
                            
                            </div>
                        </Card>
                        <Card className="shadow w-full">
                            <CardHeader className="flex rounded-t-md bg-cstm-primary p-3 pl-5 text-xl font-semibold text-white">
                                Social Media Links
                            </CardHeader>
                                <div className="flex flex-col p-4 gap-4 w-full">
                                    <FormField
                                        control={form.control}
                                        name="facebookUrl"
                                        render = {({field}) => (
                                            <FormItem className="w-full flex flex-col">
                                                <div className="flex items-center gap-4">
                                                    <FormLabel className="text-cstm-primary">
                                                        <SiFacebook color="currentColor"></SiFacebook>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Facebook URL" {...field} />
                                                    </FormControl>
                                                </div>
                                                <FormMessage>

                                                </FormMessage>
                                            </FormItem>
                                        )}   
                                    >
                                    </FormField>
                                    <FormField
                                        control={form.control}
                                        name="instagramUrl"
                                        render = {({field}) => (
                                            <FormItem className="w-full flex flex-col">
                                                 <div className="flex items-center gap-4">
                                                    <FormLabel className="text-cstm-primary">
                                                        <SiInstagram color="currentColor"></SiInstagram>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Instagram URL" {...field} />
                                                    </FormControl>
                                                    
                                                </div>
                                                <FormMessage>

                                                </FormMessage>
                                            </FormItem>
                                        )}   
                                    >
                                    </FormField>
                                    <FormField
                                        control={form.control}
                                        name="youtubeUrl"
                                        render = {({field}) => (
                                            <FormItem className="w-full flex flex-col">
                                                 <div className="flex items-center gap-4">
                                                    <FormLabel className="text-cstm-primary">
                                                        <SiYoutube color="currentColor"></SiYoutube>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Youtube URL" {...field} />
                                                    </FormControl>
                                                </div>
                                                <FormMessage>

                                                </FormMessage>
                                            </FormItem>
                                        )}   
                                    >
                                    </FormField>
                                    <FormField
                                        control={form.control}
                                        name="xUrl"
                                        render = {({field}) => (
                                            <FormItem className="w-full flex flex-col ">
                                                 <div className="flex items-center gap-4">
                                                    <FormLabel className="text-cstm-primary">
                                                        <SiX color="currentColor"></SiX>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="X/Twitter URL" {...field} />
                                                    </FormControl>
                                                </div>
                                                <FormMessage>

                                                </FormMessage>
                                            </FormItem>
                                        )}   
                                    >
                                    </FormField>
                                    <FormField
                                        control={form.control}
                                        name="tiktokUrl"
                                        render = {({field}) => (
                                            <FormItem className="w-full flex flex-col">
                                                <div className="flex items-center gap-4">
                                                    <FormLabel className="text-cstm-primary">
                                                        <SiTiktok color="currentColor"></SiTiktok>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Tiktok URL" {...field} />
                                                    </FormControl>
                                                </div>
                                                <FormMessage>

                                                </FormMessage>
                                            </FormItem>
                                        )}   
                                    >
                                    </FormField>
                                </div>
                        </Card>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </Form>
        </>
    )
}