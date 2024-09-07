import { cn } from "@/lib/utils"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ReactNode } from "react"
import { buttonVariants } from "../ui/button"

export const metadata: Metadata = {
    title: "Authentication",
    description: "Authentication forms built using the components.",
}

//<Link href="/examples/authentication"
//    className={cn(buttonVariants({ variant: "ghost" }),
//        "absolute right-4 top-4 md:right-8 md:top-8")} >
//    Create a tenant account
//                </Link>

function AuthImages() {
    return (
        <div className="md:hidden">
            <Image src="/examples/authentication-light.png" width={1280} height={843} alt="Authentication" className="block dark:hidden" />
            <Image src="/examples/authentication-dark.png" width={1280} height={843} alt="Authentication" className="hidden dark:block" />
        </div>
    )
}

function SidebarContent() {
    return (
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
            <div className="absolute inset-0 bg-zinc-900" />
            <div className="relative z-20 flex items-center text-lg font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-6 w-6">
                    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg> Acme Inc
            </div>
            <div className="relative z-20 mt-auto">
                <blockquote className="space-y-2">
                    <p className="text-lg"> “This library has saved me countless hours of work and helped me deliver stunning designs to my clients faster than ever before.” </p>
                    <footer className="text-sm">Sofia Davis</footer>
                </blockquote>
            </div>
        </div>
    )
}

export function AuthLayout({ children, link, text }: { children: ReactNode; link: string; text: string }) {
    return (
        <>
            <AuthImages />
            <div className="container relative flex flex-col items-center justify-center h-screen md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">

                <SidebarContent />
                <div className="lg:p-8 flex-grow">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 ">

                        {/* add a button to create a tenant account */}
                        <Link href={link}
                            className={cn(buttonVariants({ variant: "ghost" }),
                                "md:absolute md:right-8 md:top-8 block right-4 top-4")} >
                            {text}
                        </Link>

                        {children}
                        <p className="px-8 text-center text-sm text-muted-foreground">
                            By clicking continue, you agree to our{" "}
                            <Link
                                href="/terms"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                                href="/privacy"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}