import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

import { ChevronDown, FileText, LayoutDashboard, StarsIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { checkUser } from "@/lib/checkUser";

const Navbar = async () => {
  await checkUser();
  return (
    <header className="fixed top-0 w-full border-b bg-black backdrop-blur-md z-50 supports-[backdrop-filter]:bg-black">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/logo1.png"
            alt="Mentr2B"
            width={300}
            height={60}
            className="h-[72px] py-1 w-auto object-contain"
          />
        </Link>
        <div className="flex items-center space-x-2 md:space-x-4 ">
        <SignedIn>
            <Link href={"/dashboard"}>
            <Button>
                <LayoutDashboard className="h-4 w-4"/>
                <span className="hidden md:block ">Industry Insights</span>
            </Button>
            </Link>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button>
                        <StarsIcon className="h-4 w-4"/>
                        <span className="hidden md:block">Growth Tools</span>
                        <ChevronDown className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                        <Link href={"/interview"} className="flex items-center gap-2">
                            <FileText className="h-4 w-4"/>
                            <span>Quiz</span>                            
                        </Link>
                    </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                        <Link href={"/ai-Interview"} className="flex items-center gap-2">
                            <FileText className="h-4 w-4"/>
                            <span>Mock Interview</span>                            
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={"/resume"} className="flex items-center gap-2">
                            <FileText className="h-4 w-4"/>
                            <span>Build Resume</span>                            
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={"/ai-cover-letter"} className="flex items-center gap-2">
                            <FileText className="h-4 w-4"/>
                            <span>Cover Letter</span>                            
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SignedIn>

        <SignedOut>
         <SignInButton mode="modal">
          <Button>
            Login
            </Button></SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton
          
          afterSignOutUrl="/"
          />
        </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
