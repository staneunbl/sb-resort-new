import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGlobalStore } from "@/store/useGlobalStore";
import { addWeeks } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import SelectComponent from "@/components/SelectComponent";
import { useTranslation } from "next-export-i18n";
import { addRoomRate, editAmenity, editRoomRate } from "@/app/ServerAction/rooms.action";
import { useEffect } from "react";

export function AmenitiesModal() {

    const {
        amenityFormModalState,
        setAmenityFormModalState,
        selectedAmenity,
        amenityQuery
    } = useGlobalStore()

    const {refetch} = amenityQuery()

    const formSchema = z.object({
        Label: z.string().min(1, "Required"),
        Description: z.string().min(1, "Required"),
    });

    const form = useForm<z.infer<typeof formSchema>>({
      mode: "onChange",
      resolver: zodResolver(formSchema),
      values: {
        Label: selectedAmenity.Label,
        Description: selectedAmenity.Description
      }
    });

    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            const {res: data, error} = await editAmenity(selectedAmenity.Id, values.Label, values.Description)
            
            if(error) throw new Error("Error")

            return data
        },
        onSuccess: (data) => {
            toast.success("Amenity updated successfully");
            refetch();
            setAmenityFormModalState(false);
        },
        onError: (error) => {
            toast.error(error.message);
        }
      });

    function onSubmit(values: z.infer<typeof formSchema>) {
        mutation.mutate(values);
    }

    return (
        <Dialog
          open={amenityFormModalState}
          onOpenChange={(open) => {
            setAmenityFormModalState(open);
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                Edit Amenity
              </DialogTitle>
              <DialogDescription>
                Edit an Amenity's Label and Description
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form className="gap-4 flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  name="Label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <Input
                        placeholder="Label"
                        {...field}
                      />
                      <FormDescription>
                        Used to display the Amenity in the system.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}>
                </FormField>
                <FormField
                  name="Description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <Input
                        placeholder="Description"
                        {...field}
                      />
                      <FormDescription>
                        Text to be displayed to the customer.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}>
                </FormField>
                <DialogFooter>
                <Button
                  type="button"
                  variant="ghost">
                    Cancel
                  </Button>
                  <Button
                  type="submit"
                  variant="default">
                    Save
                  </Button>
                </DialogFooter>
                </form>
            </Form>
          </DialogContent>
        </Dialog>
      );
}