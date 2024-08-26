import { Metadata } from "next"


import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "@/components/ui/sidebar-nav"

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
}



interface CreatePropertyLayoutProps {
  children: React.ReactNode
}

export default function CreatePropertyLayout({ children }: CreatePropertyLayoutProps) {
  return (
    <>
      
      <div className="pb-16 md:block ">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Create Property</h2>
          <p className="text-muted-foreground">
            Create a new property for your organization.
          </p>
        </div>
        <Separator className="my-6" />
        
          <div>{children}</div>
        </div>
      
    </>
  )
}