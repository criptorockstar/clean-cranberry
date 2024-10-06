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
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useProducts from "@/hooks/useProducts";
import {
  PlusCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import useAdmin from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useMediaQuery } from "@/components/use-media-query";
import { useAppDispatch, useAppSelector } from '@/store/store';
import { cleanProduct } from "@/store/slices/productSlice";

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

export default function Products() {
  const { getPaginatedProducts, products, totalPages } = useProducts();
  const { deleteProduct } = useAdmin();

  const router = useRouter();
  const searchParams = useSearchParams();

  const pageFromURL = searchParams.get("page")
  const initialPageIndex = pageFromURL ? parseInt(pageFromURL) - 1 : 0;
  const [pageIndex, setPageIndex] = React.useState<number>(initialPageIndex);
  const [pageSize, setPageSize] = React.useState<number>(10);

  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = React.useState<string>("");

  const { toast } = useToast();
  const [columnVisibility, setColumnVisibility] = React.useState({
    price: true,
    stock: true,
    offer: true,
  });

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const handlePopState = () => {
      dispatch(cleanProduct());
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [dispatch]);

  const isMobile = useMediaQuery('(max-width: 1200px)');
  React.useEffect(() => {
    if (isMobile) {
      setColumnVisibility({
        price: false,
        stock: false,
        offer: true,
      });
    } else {
      setColumnVisibility({
        price: true,
        stock: true,
        offer: true,
      });
    }
  }, [isMobile]);

  const [deleteProductId, setDeleteProductId] = React.useState<number | null>(null);
  const [isAlertDialogOpen, setAlertDialogOpen] = React.useState(false);
  const handleDeleteCategory = async () => {
    if (deleteProductId !== null) {
      try {
        await deleteProduct(deleteProductId);
        toast({
          variant: "success",
          description: "Producto eliminado con éxito",
        });
        setAlertDialogOpen(false);
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
        setAlertDialogOpen(false);
      }
    }
  };

  const openAlertDialog = (id: number) => {
    setDeleteProductId(id);
    setAlertDialogOpen(true);
  };

  React.useEffect(() => {
    loadProducts();
  }, [searchTerm, pageIndex]);

  React.useEffect(() => {
    const searchParams = new URLSearchParams();
    if (searchTerm) searchParams.set("search", searchTerm);
    router.push(`/dashboard/products?page=${pageIndex + 1}&${searchParams.toString()}`);
  }, [searchTerm, pageIndex]);

  const loadProducts = async () => {
    try {
      const response = await getPaginatedProducts(pageIndex + 1, pageSize, searchTerm);
      console.log(response);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "images",
      header: "Producto",
      cell: ({ row }) => {
        const images = row.original.images;
        const firstImageUrl = images.length > 0 ? images[0].url : "/placeholder-image.png";

        return (
          <div className="table-cell">
            <img
              alt="Imagen producto"
              className="aspect-square rounded-md object-cover"
              height="64"
              src={firstImageUrl}
              width="64"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const quantity = row.original.quantity;
        return quantity === "ilimitado" ? (
          <div>∞</div>
        ) : (
          <div>{row.original.stock}</div> // Se muestra el stock si no es ilimitado
        );
      },
    },
    {
      accessorKey: "price",
      header: "Precio",
      cell: ({ row }) => <div className="lowercase">{row.getValue("price")}</div>,
    },
    {
      accessorKey: "offer",
      header: "Oferta",
      cell: ({ row }) => <div className="lowercase">{row.getValue("offer")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => window.location.href = `/dashboard/products/edit/${product.slug}`}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openAlertDialog(product.id)}>
                Borrar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ];

  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

  const table = useReactTable({
    data: products || [],
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
    onColumnVisibilityChange: (newVisibility) => {
      setColumnVisibility((prevState) => ({
        ...prevState,
        ...newVisibility,
      }));
    },
    onPaginationChange: (updater) => {
      const newPaginationState =
        typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      handlePageChange(newPaginationState.pageIndex);
      setPageSize(newPaginationState.pageSize);
    },
  });

  return (
    <div className="flex flex-col">
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de que deseas eliminar este producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El producto se eliminará permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertDialogOpen(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Productos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <main className="grid flex-1 items-start gap-2 p-2 sm:px-6 sm:py-0 md:gap-6">
        <div className="w-full">
          <div className="flex justify-between flex-col-reverse lg:flex-row">
            <div className="flex items-center py-4 flex-grow">
              <Input
                placeholder="Filtra por nombre..."
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  // Updates search term
                  table.getColumn("name")?.setFilterValue(event.target.value);
                }}
                className="w-full lg:max-w-sm"
              />
            </div>
            {/*col*/}
            <div className="flex items-center">
              <div className="ml-auto flex items-center gap-2">
                <Button size="sm" className="h-7 gap-1" onClick={() => window.location.href = "/dashboard/products/add"}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Agregar producto
                  </span>
                </Button>
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
                      No se encontraron productos.
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
