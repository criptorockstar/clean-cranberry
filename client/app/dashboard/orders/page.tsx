"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import { useMediaQuery } from "@/components/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useOrder from "@/hooks/useOrder";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useAppDispatch } from "@/store/store";
import { setOrderStatus } from "@/store/slices/orderSlice";

export interface IOrder {
  id: number;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  shippingAddress: {
    id: number;
    address: string;
    door: string | null;
    zip: string;
    phone: string;
  };
  items: Array<{}>;
  user: {
    id: number;
  };
}

export interface IUser {
  id: number;
  username: string;
  email: string;
  reset_password_token: string | null;
  roles: string;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderState {
  orders: IOrder[];
  total: number;
  page: number;
  limit: number;
}

export default function Orders() {
  const { getPaginatedOrders, orders, totalPages, updateOrder } = useOrder();


  const [columnVisibility, setColumnVisibility] = React.useState({
    total: true,
    user: true,
  });

  const isMobile = useMediaQuery('(max-width: 1200px)');
  React.useEffect(() => {
    if (isMobile) {
      setColumnVisibility({
        total: false,
        user: false,
      });
    } else {
      setColumnVisibility({
        total: true,
        user: true,
      });
    }
  }, [isMobile]);

  const router = useRouter();
  const searchParams = useSearchParams();

  const pageFromURL = searchParams.get("page")
  const initialPageIndex = pageFromURL ? parseInt(pageFromURL) - 1 : 0;
  const [pageIndex, setPageIndex] = React.useState<number>(initialPageIndex);
  const [pageSize, setPageSize] = React.useState<number>(10);

  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = React.useState<string>("");

  React.useEffect(() => {
    loadOrders();
  }, [searchTerm, pageIndex]);

  React.useEffect(() => {
    const searchParams = new URLSearchParams();
    if (searchTerm) searchParams.set("search", searchTerm);
    router.push(`/dashboard/orders?page=${pageIndex + 1}&${searchParams.toString()}`);
  }, [searchTerm, pageIndex]);

  const loadOrders = async () => {
    try {
      await getPaginatedOrders(pageIndex + 1, pageSize, searchTerm);
    } catch (error) {
      console.error("Error loading orders:", error);
    }
  };

  const dispatch = useAppDispatch();
  const updateStatus = async (id: number, data: any) => {
    await updateOrder(id, data)
    dispatch(setOrderStatus({ id: id, status: data }));
  }

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "user",
      header: "Nombre",
      cell: ({ row }) => <div className="lowercase">{row.original.user.username}</div>,
    },
    {
      accessorKey: "total",
      header: "Precio",
      cell: ({ row }) => <div className="lowercase">${row.original.total}</div>,
    },
    {
      accessorKey: "orderNumber",
      header: "Código de seguimiento",
      cell: ({ row }) => <div className="lowercase">{row.getValue("orderNumber")}</div>,
    },
    {
      id: "status",
      header: "Estado",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex items-center">
                  <span
                    className={`text-[16px] ${row.original.status === "Pagado"
                      ? "text-green-500"
                      : row.original.status === "Pendiente"
                        ? "text-red-500"
                        : ""
                      }`}
                  >
                    {row.original.status}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => updateStatus(row.original.id, "Pagado")}>
                  <span className="text-green-500">Pagado</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateStatus(row.original.id, "Pendiente")}>
                  <span className="text-red-500">Pendiente</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )
      },
    },
  ];

  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

  const table = useReactTable({
    data: orders.orders || [],
    columns,
    pageCount: -1,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    state: {
      rowSelection,
      pagination: { pageIndex, pageSize },
      columnVisibility,
    },
    onPaginationChange: (updater) => {
      const newPaginationState =
        typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      handlePageChange(newPaginationState.pageIndex);
      setPageSize(newPaginationState.pageSize);
    },
  });

  console.log(orders.orders)

  return (
    <div className="flex flex-col">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Pedidos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <main className="grid flex-1 items-start gap-2 p-2 sm:px-6 sm:py-0 md:gap-6">
        <div className="w-full">
          <div className="flex justify-between flex-col-reverse lg:flex-row">
            <div className="flex items-center py-4 flex-grow">
              <Input
                placeholder="Filtra por código de seguimiento..."
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  // Actualiza el filtro para la columna "orderNumber"
                  table.getColumn("orderNumber")?.setFilterValue(event.target.value);
                }}
                className="w-full lg:max-w-sm"
              />
            </div>
            {/*col*/}
            <div className="flex items-center">
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center">
                      No se encontraron categorías.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} de{" "}
              {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Atrás
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={pageIndex + 1 >= totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
