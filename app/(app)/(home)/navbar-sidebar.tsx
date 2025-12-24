import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
interface NavbarItemProps {
  href: string;
  children: React.ReactNode;
}
interface NavbarSidebarProps {
  items: NavbarItemProps[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export const NavbarSidebar = ({
  items,
  open,
  onOpenChange,
}: NavbarSidebarProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0 transition-none">
        <SheetHeader className=" p-4 border-b">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <ScrollArea
          className=" flex flex-col overflow-y-auto h-full pb-2 
        [&_a]:w-full [&_a]:text-left [&_a]:p-4 [&_a]:hover:bg-black [&_a]:hover:text-white [&_a]:flex [&_a]:items-center [&_a]:text-base [&_a]:font-medium"
        >
          {items.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              onClick={() => onOpenChange(false)}
            >
              {item.children}
            </Link>
          ))}
          <div className=" border-t">
            <Link href={"/sign-in"}>Log in</Link>
            <Link href={"/sign-up"}>Start selling</Link>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
