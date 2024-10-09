"use client"

import * as React from "react";
import useOrder from "@/hooks/useOrder";
import { useAppDispatch } from "@/store/store";
import { setOrderStatus } from "@/store/slices/orderSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ICategory {
  id: number;
  name: string;
  slug: string;
  image: string;
}

interface IColor {
  id: number;
  name: string;
  code: string;
}

interface ISize {
  id: number;
  name: string;
}

interface IImage {
  id: number;
  url: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  quantity: string;
  stock: number;
  price: number;
  offer: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  categories: ICategory[];
  colors: IColor[];
  sizes: ISize[];
  images: IImage[];
}

export default function OrderPage({ params }: any) {
  const { getOrderByNumber } = useOrder();
  const [order, setOrder] = React.useState<any>({
    id: null,
    orderNumber: '',
    total: 0,
    status: '',
    createdAt: '',
    updatedAt: '',
    user: {
      username: '',
      email: ''
    },
    shippingAddress: {
      address: '',
      door: '',
      zip: '',
      phone: ''
    },
    items: []
  });

  const getOrder = async () => {
    const response = await getOrderByNumber(params.order);
    setOrder(response);
    console.log(response)
  }

  React.useEffect(() => {
    getOrder();
  }, []);

  const { updateOrder } = useOrder();
  const dispatch = useAppDispatch();

  const updateStatus = async (id: number, data: any) => {
    await updateOrder(id, data);

    // Actualiza el estado en Redux
    dispatch(setOrderStatus({ id: order.id, status: data }));

    // Actualiza el estado local
    setOrder((prevOrder: any) => ({
      ...prevOrder,
      status: data // Cambiar el status local del pedido
    }));
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "product",
      header: "Producto",
      // Acceder correctamente al producto dentro de cada item
      cell: ({ row }) => (
        <>
          <div className="lowercase">
            {row.original.product.name}
          </div>
        </>
      ),
    },
    {
      accessorKey: "quantity",
      header: () => <div className="text-right">Cantidad</div>, // Alinea el encabezado a la derecha
      cell: ({ row }) => <div className="text-right">{row.original.quantity} unidad/es</div>, // Alinea el contenido a la derecha
    },
  ];

  const table = useReactTable({
    data: order.items || [],
    columns,
    pageCount: -1,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
  });

  return (
    <React.Fragment>
      <div className="grid grid-cols-2">
        <div>
          <div className="text-xl font-semibold">
            Información del cliente
          </div>

          <div className="mt-3 font-semibold">
            Cliente
          </div>
          <div>
            {order.user.username}
          </div>

          <div className="mt-3 font-semibold">
            Correo electrónico
          </div>
          <div>
            {order.user.email}
          </div>

          <div className="mt-3 font-semibold">
            Teléfono
          </div>
          <div>
            {order.shippingAddress.phone}
          </div>
        </div>

        <div>
          <div className="text-xl font-semibold">
            Datos de envio
          </div>

          <div className="mt-3 font-semibold">
            Dirección
          </div>
          <div>
            {order.shippingAddress.address}
          </div>

          <div className="mt-3 font-semibold">
            Número
          </div>
          <div>
            {order.shippingAddress.door}
          </div>

          <div className="mt-3 font-semibold">
            Código postal
          </div>
          <div>
            {order.shippingAddress.zip}
          </div>
        </div>

        <div className="mt-8">
          <div className="text-xl font-semibold">
            Pedido
          </div>

          <div className="mt-3 font-semibold">
            Precio
          </div>
          <div>
            ${order.total}
          </div>

          <div className="mt-3 font-semibold">
            Seguimiento
          </div>
          <div>
            {order.orderNumber}
          </div>

          <div className="mt-3 font-semibold">
            Estado
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex items-center">
                  <span
                    className={`text-[16px] ${order.status === "Pagado" || order.status === "Enviado"
                      ? "text-green-500"
                      : order.status === "Pendiente" || order.status === "Rechazado"
                        ? "text-red-500"
                        : ""
                      }`}
                  >
                    {order.status}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => updateStatus(order.id, "Pagado")}>
                  <span className="text-green-500">Pagado</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateStatus(order.id, "Pendiente")}>
                  <span className="text-red-500">Pendiente</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
                  No se encontraron pedidos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </React.Fragment>
  )
}
