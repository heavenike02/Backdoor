import { Metadata } from "next"
import Image from "next/image"

import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "@/components/ui/sidebar-nav"

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
}

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/examples/forms",
  },
  {
    title: "Account",
    href: "/examples/forms/account",
  },
  
]

interface CreatePropertyLayoutProps {
  children: React.ReactNode
}

export default function CreatePropertyLayout({ children }: CreatePropertyLayoutProps) {
  return (
    <>
      
      <div className="  pb-16 md:block ">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Create Property</h2>
          <p className="text-muted-foreground">
            Create a new property for your organization.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  )
}