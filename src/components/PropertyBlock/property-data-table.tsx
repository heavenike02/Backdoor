"use client"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { type Property } from "@/components/PropertyBlock/property-schema"
import { ShareDialog } from "@/components/ui/share-dialog"
import { useToastMutation } from "@/hooks/useToastMutation"
import { deletePropertyById } from './property-queries'

const columnDisplayNames: Record<string, string> = {
  "property_type": "Property Type",
  "address_line_one": "Address",
  "created_by": "Created By",
};

export function PropertyDataTable({ data }: { data: Property[] }) {
  const [tableData, setTableData] = React.useState<Property[]>(data); // New state for table data

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const { mutate, isLoading } = useToastMutation(
    async (propertyId: string) => {
      await deletePropertyById(propertyId);
      // Fetch new data after deletion
      setTableData((prev) => prev.filter(property => property.id !== propertyId));
    },
    {
      loadingMessage: 'Deleting property...',
      successMessage: 'Property deleted successfully',
      errorMessage: 'Failed to delete property',
    },
  );

  // Update table data when the initial data prop changes
  React.useEffect(() => {
    setTableData(data);
  }, [data]);

  const columns: ColumnDef<Property>[] = [

    {
      accessorKey: "address_line_one",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Address
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("address_line_one")}</div>,
    },
    {
      accessorKey: "property_type",
      header: "Property Type",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("property_type")}</div>
      ),
    },
    {
      accessorKey: "created_by",
      header: "Created By",
      cell: ({ row }) => <div>{row.getValue("created_by")}</div>,
    },
    {
      id: "share",
      cell: ({ row }) => {
        const property = row.original
        return <ShareDialog propertyId={property.id} />
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const property = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  const appLink = `${process.env.NEXT_PUBLIC_SITE_URL}/application/${property.id}`; // Use the environment variable
                  navigator.clipboard.writeText(appLink);
                }}
              >
                Copy Application Link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit Property</DropdownMenuItem>
              <DropdownMenuItem onClick={() => mutate(property.id)} disabled={isLoading}>Delete Property</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: tableData, // Use the new state for table data
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter addresses..."
          value={(table.getColumn("address_line_one")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("address_line_one")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              View <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {columnDisplayNames[column.id] || column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {/*table.getFilteredSelectedRowModel().rows.length} of{" "}*/}
          {/*table.getFilteredRowModel().rows.length} row(s) selected.*/}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}