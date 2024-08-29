import { Metadata } from "next"


import { Separator } from "@/components/ui/separator"




interface CreatePropertyLayoutProps {
  children: React.ReactNode
}

export default function CreatePropertyLayout({ children }: CreatePropertyLayoutProps) {
  return (
    <>
      {/* Mid block section */}
      <div className="mid-block">
        {/* Add your mid block content here */}
      </div>
      <div>{children}</div>
    </>
  )
}