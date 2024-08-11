"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MenuItem {
  label: string
  action: () => void
  shortcut?: string
}

interface SubMenuItem {
  label: string
  value: string
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  schema: (data: TData) => any
  menuItems: MenuItem[]
  subMenuItems?: {
    label: string
    items: SubMenuItem[]
    currentValue: string
    onValueChange: (value: string) => void
  }
}

export function DataTableRowActions<TData>({
  row,
  schema,
  menuItems,
  subMenuItems,
}: DataTableRowActionsProps<TData>) {
  const item = schema(row.original)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {menuItems.map((menuItem, index) => (
          <DropdownMenuItem key={index} onClick={menuItem.action}>
            {menuItem.label}
            {menuItem.shortcut && (
              <DropdownMenuShortcut>{menuItem.shortcut}</DropdownMenuShortcut>
            )}
          </DropdownMenuItem>
        ))}
        {subMenuItems && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>{subMenuItems.label}</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={subMenuItems.currentValue} onValueChange={subMenuItems.onValueChange}>
                  {subMenuItems.items.map((subItem) => (
                    <DropdownMenuRadioItem key={subItem.value} value={subItem.value}>
                      {subItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}