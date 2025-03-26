import * as React from "react";

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
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  RadioGroup,
  RadioGroupItem,
} from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { ChevronLeft, ChevronRight, Filter, Search, X } from "lucide-react";

import { cn } from "~/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  showFilters: boolean;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  showFilters = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
    },
  });

  // Get active filters count
  const activeFiltersCount = columnFilters.length + (globalFilter ? 1 : 0);

  const statusOptions = [
    { value: "ONLINE", label: "Online", color: "bg-green-500" },
    { value: "IDLE", label: "Idle", color: "bg-yellow-500" },
    { value: "DND", label: "Do Not Disturb", color: "bg-red-500" },
    { value: "INVISIBLE", label: "Invisible", color: "bg-gray-500" },
    { value: "OFFLINE", label: "Offline", color: "bg-gray-700" },
  ];

  return (
    <div>
      {showFilters && (
        <div className="flex items-center justify-between flex-wrap py-4">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-2.5 top-3 size-4 text-muted-foreground" />
            <Input
              placeholder="Search all columns..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full pl-8 sm:w-[300px]"
            />
            {globalFilter && (
              <Button variant="ghost" onClick={() => setGlobalFilter("")} className="absolute right-[5.15rem] -top-[1px] size p-0">
                <X className="size-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Filter className="size-3.5" />
                  <span>Filter</span>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1 rounded-full px-1 font-normal">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[220px] p-0" align="end">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="font-normal">Filters</div>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setColumnFilters([]);
                        setGlobalFilter("");
                      }}
                      className="h-8 px-2 text-xs font-normal"
                    >
                      Reset all
                    </Button>
                  )}
                </div>
                
                <Separator />

                <div className="space-y-3 px-3 py-2">
                  {/* Username filter */}
                  <div className="space-y-1">
                    <Label htmlFor="username-filter" className="text-xs font-medium">
                      Username
                    </Label>
                    <div className="relative">
                      <Input
                        id="username-filter"
                        placeholder="Filter username..."
                        value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn("username")?.setFilterValue(event.target.value)}
                        className="h-8 text-xs"
                      />
                      {!!(table.getColumn("username")?.getFilterValue()) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => table.getColumn("username")?.setFilterValue("")}
                          className="absolute right-0 top-0 size-8 p-0"
                        >
                          <X className="size-3" />
                          <span className="sr-only">Clear</span>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Roles filter */}
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Roles</Label>
                    <div className="relative">
                      <Input
                        placeholder="Filter roles..."
                        value={(table.getColumn("roles")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => table.getColumn("roles")?.setFilterValue(event.target.value)}
                        className="h-8 text-xs"
                      />
                      {!!table.getColumn("roles")?.getFilterValue() && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => table.getColumn("roles")?.setFilterValue("")}
                          className="absolute right-0 top-0 size-8 p-0"
                        >
                          <X className="size-3" />
                          <span className="sr-only">Clear</span>
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium">Status</Label>
                      {!!table.getColumn("status")?.getFilterValue() && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => table.getColumn("status")?.setFilterValue("")}
                          className="h-6 px-2 text-xs"
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                    <RadioGroup
                      value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
                      onValueChange={(value) => table.getColumn("status")?.setFilterValue(value)}
                      className="grid grid-cols-1 gap-1"
                    >
                      <div className="flex items-center rounded-md border px-3 py-1.5">
                        <RadioGroupItem value="" id="status-all" className="mr-2" />
                        <Label htmlFor="status-all" className="flex flex-1 items-center text-xs cursor-pointer">
                          <span className="size-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 mr-2"></span>
                          All Statuses
                        </Label>
                      </div>
                      {statusOptions.map((status) => (
                        <div
                          key={status.value}
                          className={cn(
                            "flex items-center rounded-md border px-3 py-1.5",
                            table.getColumn("status")?.getFilterValue() === status.value && "border-primary bg-muted",
                          )}
                        >
                          <RadioGroupItem value={status.value} id={`status-${status.value}`} className="mr-2" />
                          <Label
                            htmlFor={`status-${status.value}`}
                            className="flex flex-1 items-center text-xs cursor-pointer"
                          >
                            <span className={`size-2 rounded-full ${status.color} mr-2`}></span>
                            {status.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.id !== "actions" && column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id[0].toUpperCase() + column.id.slice(1)}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="py-0.5">
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row py-4">
        <div className="text-sm text-muted-foreground">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length,
          )}{" "}
          of {table.getFilteredRowModel().rows.length} members
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="size-8 p-0"
            >
              <ChevronLeft className="size-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <div className="text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="size-8 p-0"
            >
              <ChevronRight className="size-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
};
