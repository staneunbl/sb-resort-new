import { capitalizeFirstLetter } from "@/utils/Helpers";
import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutBtn from "./LogoutBtn";
import LanguageSwitcherComp from "./LanguageSwitcher";
export default function UserProfile({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  return (
    <div className="">
      
      <DropdownMenu >
        <DropdownMenuTrigger>
          <div className="font-base flex h-max w-max items-center gap-3 rounded-full border border-white px-3 py-3 text-xl">
            <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>{capitalizeFirstLetter(firstName)}</AvatarFallback>
            </Avatar>
            <h1 className="text-base font-semibold text-white">
              {capitalizeFirstLetter(firstName)} {capitalizeFirstLetter(lastName)}
            </h1>
            <ChevronRight size={25} className="h-max" color="white" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <LanguageSwitcherComp lang="en" label="🇺🇸 English" />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LanguageSwitcherComp lang="ja" label="🇯🇵 Japanese" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogoutBtn className="text-danger font-semibold" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
