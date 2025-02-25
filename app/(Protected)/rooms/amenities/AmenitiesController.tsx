import { Button } from "@/components/ui/button";
import { useGlobalStore } from "@/store/useGlobalStore";
import { Plus } from "lucide-react";
import { useTranslation } from "next-export-i18n";
import { useRouter } from "next/navigation";

export default function AmenitiesController() {
    
    const router = useRouter();
    const { amenityFormModalState, setAmenityFormModalState, selectedAmenity, setSelectedAmenity } = useGlobalStore();
    const { t } = useTranslation();
    const genI18n = t("general");
    const amenityI18n = t("Amenity")
    
    return (
        <div className="flex w-full flex-row items-center justify-end gap-2 border-b border-cstm-border px-4 py-3 mb-3">
        <Button
          className="flex items-center gap-2 bg-cstm-secondary text-cstm-tertiary"
          onClick={() => {
            setSelectedAmenity({} as any);
            setTimeout(() => {
                setAmenityFormModalState(true);
            }, 100)
          }}
        >
          <Plus size={16} />
          {amenityI18n.addAmenity}
        </Button>
      </div>
    )
}