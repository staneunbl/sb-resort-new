"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardHeader } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Tiptap from "@/components/Tiptap";
import { useRouter } from "next/navigation";
import SelectComponent from "@/components/SelectComponent";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addRoomType,
  deleteRoomType,
  editRoomType,
  getEditValues,
} from "@/app/ServerAction/rooms.action";
import { toast } from "sonner";
import { useTranslation } from "next-export-i18n";
import { XIcon } from "lucide-react";

export default function RoomTypeForm({ id }: { id?: string | undefined }) {
  const { t } = useTranslation();
  const roomsI18n = t("RoomsPage");
  const generalI18n = t("general");
  const { bedTypeOptionsQuery } = useGlobalStore();
  const { data: bedTypeOptions } = bedTypeOptionsQuery();

  const router = useRouter();

  const { data: editValues } = useQuery({
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryKey: ["getEditValues", id],
    queryFn: async () => {
      const res = await getEditValues(id);
      if (!res.success) {
        throw new Error(res.error);
      }
      ``;
      return res.res?.[0];
    },
  });

  const formSchema = z.object({ 
    /* Room Details */
    roomTypeName: z.string().min(1, { message: "Required" }),
    adultCount: z.string().min(1, { message: "Required" }),
    childCount: z.string().min(1, { message: "Required" }),
    bedType: z.string().min(1, { message: "Required" }),
    /* Weekend Rate */
    baseRoomRate: z.string().min(1, { message: "Required" }),
    extraChildWeekEndRate: z.string().min(1, { message: "Required" }),
    extraAdultWeekEndRate: z.string().min(1, { message: "Required" }),
    /* Weekday Rate */
    weekendRoomRate: z.string().min(1, { message: "Required" }),
    extraChildWeekDayRate: z.string().min(1, { message: "Required" }),
    extraAdultWeekDayRate: z.string().min(1, { message: "Required" }),
    /* Descrption */
    description: z.string().min(1, { message: "Required" }),
    image_urls: z.array(z.string().url().optional())
  });

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    values: {
      roomTypeName: id ? editValues?.RoomType : "",
      adultCount: id ? editValues?.MaxAdult.toString() : "",
      childCount: id ? editValues?.MaxChild.toString() : "",
      bedType: id ? editValues?.BedTypeId.toString() : "",
      /* ============ */
      weekendRoomRate: id ? editValues?.WeekendRoomRate.toString() : "",
      extraChildWeekEndRate: id
        ? editValues?.WeekendExtraChildRate.toString()
        : "",
      extraAdultWeekEndRate: id
        ? editValues?.WeekendExtraAdultRate.toString()
        : "",
      /* ------------ */
      baseRoomRate: id ? editValues?.BaseRoomRate.toString() : "",
      extraChildWeekDayRate: id ? editValues?.ExtraChildRate.toString() : "",
      extraAdultWeekDayRate: id ? editValues?.ExtraAdultRate.toString() : "",
      description: id ? editValues?.Description.toString() : defaultDescription,
      image_urls: id ? editValues?.image_urls || [] : []
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await addRoomType(data);
      if (!res.success) {
        throw new Error(res.error);
      }
      return res;
    },
    onSuccess: () => {
      toast.success("Room Type Added", {
        description: "Room Type Added Successfully",
      });
    },
    onError: (error) => {
      toast.error("Adding Room Type Failed"),
        {
          description:
            "There was an error adding the Room Type. Please try again later.",
        };
    },
  });
  const editMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await editRoomType({
        ...data,
      });
      if (!res.success) {
        throw new Error(res.error);
      }
      return res;
    },
    onSuccess: () => {
      toast.success("Room Type Edited", {
        description: "Room Type Edited Successfully",
      });
      router.push("/rooms/viewroomtypes");
    },
    onError: (error) => {
      toast.error("Editing Room Type Failed"),
        {
          description:
            "There was an error editing the Room Type. Please try again later.",
        };
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (id) {
      editMutation.mutate({
        ...values,
        RateTypeId: editValues?.RateTypeId,
        RoomRateId: editValues?.RoomRateID,
        RoomTypeId: editValues?.RoomTypeId,
      });
    } else {
      addMutation.mutate(values);
    }
  }
  return (
    <div className="w-full p-4">
      {/* {
        editValues ? (
          editValues.Images.map((image: any) => {
            return <img src={image} className="w-full h-[200px] object-contain" />
          })          
        ) : (
          null
        )
      } */}
      <div className="flex justify-between mb-4">
        <p className="text-2xl font-semibold text-cstm-secondary">{ editValues ? `Editing Room Type ${editValues.RoomType}` : "New Room Type" }</p>
        <div className="flex gap-4">
          <Button
            className="border-2 border-cstm-secondary text-cstm-secondary bg-transparent"
            onClick={(e) => {
              e.preventDefault();
              router.push("/rooms/viewroomtypes");
            }}
          >
            {generalI18n.cancel}
          </Button>
          <Button className="bg-cstm-secondary">
            {roomsI18n.saveNewRoomType}
          </Button>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-start gap-4">
            <div className="flex w-1/2 flex-col gap-4">
              <Card className="bg-cstm-secondary">
                <CardHeader className="flex rounded-t-md bg-cstm-primary p-3 pl-5 text-xl font-semibold text-white">
                  {roomsI18n.roomDetails}
                </CardHeader>
                <div className="flex space-x-4 p-4">
                  <div className="w-1/2 space-y-1">
                    <FormField
                      control={form.control}
                      name="roomTypeName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            {roomsI18n.typeName}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <div>
                            <FormControl>
                              <Input
                                placeholder={roomsI18n.enterTypeName}
                                {...field}
                              />
                            </FormControl>
                            <div className="h-4">
                              <FormMessage />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="adultCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            {roomsI18n.maxAdults}{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <div>
                            <FormControl>
                              <Input
                                placeholder={roomsI18n.enterMaxAdults}
                                type="number"
                                {...field}
                              />
                            </FormControl>
                            <div className="h-4">
                              <FormMessage />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-1/2 space-y-1">
                    <FormField
                      control={form.control}
                      name="childCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            {roomsI18n.maxChildren}{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <div>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder={roomsI18n.enterMaxChildren}
                                {...field}
                              />
                            </FormControl>
                            <div className="h-4">
                              <FormMessage />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bedType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            {roomsI18n.bedType}{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <div>
                            <FormControl>
                              <SelectComponent
                                className="w-full"
                                setState={field.onChange}
                                state={field.value}
                                options={bedTypeOptions}
                                placeholder={roomsI18n.selectBedType}
                              />
                            </FormControl>
                            <div className="h-4">
                              <FormMessage />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </Card>
              <Card className="bg-cstm-secondary">
                <CardHeader className="flex rounded-t-md bg-cstm-primary p-3 pl-5 text-xl font-semibold text-white">
                  {roomsI18n.roomRates}
                </CardHeader>
                <div className="flex space-x-4 p-4 pt-2">
                  <div className="w-1/2">
                    <h1 className="text-lg text-center font-semibold text-white">
                      {`${roomsI18n.weekendRate} (${(roomsI18n.saturdayToSunday)})`}
                    </h1>
                    <FormField
                      control={form.control}
                      name="weekendRoomRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            {roomsI18n.weekendRate}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <div>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                              />
                            </FormControl>
                            <div className="h-4">
                              <FormMessage />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="extraChildWeekEndRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            {roomsI18n.extraChildRate}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <div>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                              />
                            </FormControl>
                            <div className="h-4">
                              <FormMessage />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="extraAdultWeekEndRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            {roomsI18n.extraAdultRate}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <div>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                              />
                            </FormControl>
                            <div className="h-4">
                              <FormMessage />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-1/2">
                    <h1 className="text-lg text-center font-semibold text-white">
                      {roomsI18n.weekdayRate}({roomsI18n.mondayToFriday})
                    </h1>
                    <FormField
                      control={form.control}
                      name="baseRoomRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            {roomsI18n.weekdayRate}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <div>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                              />
                            </FormControl>
                            <div className="h-4">
                              <FormMessage />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="extraChildWeekDayRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            {roomsI18n.extraChildRate}{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <div>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                              />
                            </FormControl>
                            <div className="h-4">
                              <FormMessage />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="extraAdultWeekDayRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            {roomsI18n.extraAdultRate}{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <div>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                              />
                            </FormControl>
                            <div className="h-4">
                              <FormMessage />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </Card>
              <Card className="bg-cstm-secondary">
                <CardHeader className="rounded-t-md bg-cstm-primary p-3 pl-5 text-xl font-semibold text-white">
                  {generalI18n.description}
                </CardHeader>
                <div className="p-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <div>
                          <FormControl>
                            <Tiptap {...field} />
                          </FormControl>
                          <div className="h-4">
                            <FormMessage />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </Card>
            </div>
            <div className="flex w-1/2 flex-col">
              <div className="flex flex-col justify-between gap-2">
                {/* <Button className="bg-cstm-secondary">
                  {roomsI18n.saveNewRoomType}
                </Button>
                <Button
                  className="bg-cstm-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/rooms/viewroomtypes");
                  }}
                >
                  {generalI18n.cancel}
                </Button> */}
              </div>
              <Card className="bg-cstm-secondary">
                <CardHeader className="rounded-t-md bg-cstm-primary p-3 pl-5 text-xl font-semibold text-white">
                  Room Images
                </CardHeader>
                <div className="p-4">
                  <FormField
                    control={form.control}
                    name="image_urls"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">
                          Upload Images
                        </FormLabel>
                        <div>
                          <FormControl>
                            <Input
                              className="text-lg"
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => {
                                const fileArray = Array.from(e.target.files as FileList)
                                const urls = fileArray.map((file) => URL.createObjectURL(file))
                                field.onChange([...(field.value || []), ...urls])
                              }}
                            />
                          </FormControl>
                          {
                            field.value &&
                            <>
                              <p className="text-white mt-4">Image Previews</p>
                              <div className="flex flex-wrap mt-4 p-4 gap-4 border-2 border-white/[.70] rounded-md">
                                {field.value?.map((url, index) => (
                                  <div className="relative">
                                    <img
                                      key={index}
                                      src={url}
                                      className="h-40 w-40 object-cover"
                                    />
                                    <Button 
                                      type="button"
                                      className="absolute top-2 right-2 bg-red-800 rounded-full flex items-center justify-center"
                                      onClick={() => {
                                        const updatedImgs = field.value.filter((_, i) => i !== index)
                                        field.onChange(updatedImgs)
                                      }}
                                    >
                                      <XIcon color="white" size={12}></XIcon>
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            
                            </>
                          }
                          <div className="h-4">
                            <FormMessage />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                </div>
              </Card>
            </div>
              
          </div>
        </form>
      </Form>
    </div>
  );
}

const defaultDescription: string = `Enter description here...`;
