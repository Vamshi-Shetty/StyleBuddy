import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const UserButton = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-end p-4">
        <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const avatarFallback = session?.user?.name?.charAt(0).toUpperCase() || "?";

  return (
    <nav>
      {session ? (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger
            className="relative float-right p-4 md:p-6 outline-none"
            aria-label="User menu"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                {session.user?.name || "User"}
              </span>
              <Avatar className="w-10 h-10 hover:opacity-80 transition">
                <AvatarImage
                  src={session.user?.image || undefined}
                  alt={`${session.user?.name || "User"}'s Avatar`}
                />
                <AvatarFallback className="bg-sky-900 text-white dark:bg-gray-800 dark:text-gray-200">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            side="bottom"
            className="w-48 bg-white shadow-lg rounded-md py-2 dark:bg-gray-800 dark:shadow-gray-900"
          >
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex justify-end p-4 gap-2">
          <Link href="sign-in" passHref>
            <Button className="hover:scale-105 transition bg-black text-white dark:bg-black dark:hover:bg-gray-800">
              Sign in
            </Button>
          </Link>
          <Link href="sign-up" passHref>
            <Button className="hover:scale-105 transition bg-black text-white dark:bg-black dark:hover:bg-gray-800">
              Sign up
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default UserButton;
