import { Skeleton } from "@/components/ui/skeleton";
export default function loading() {
  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <div className="flex w-full gap-4">
        <Skeleton className="h-52 w-6/12" />
        <Skeleton className="h-52 w-3/12" />
        <Skeleton className="h-52 w-3/12" />
      </div>
      <div className="flex w-full gap-4">
        <Skeleton className="h-52 w-2/12" />
        <Skeleton className="h-52 w-7/12" />
        <Skeleton className="h-52 w-3/12" />
      </div>
      <div className="flex w-full gap-4">
        <Skeleton className="h-52 w-3/12" />
        <Skeleton className="h-52 w-2/12" />
        <Skeleton className="h-52 w-7/12" />
      </div>
    </div>
  );
}
