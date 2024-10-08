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
import useCategories from "@/hooks/useCategories";
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

interface Category {
  id: number;
  name: string;
  image: string;
  slug: string;
}

export default function Categories() {
  const { getPaginatedCategories, categories, totalPages } = useCategories();
  const { deleteCategory } = useAdmin();

  const router = useRouter();
  const searchParams = useSearchParams();

  const pageFromURL = searchParams.get("page")
  const initialPageIndex = pageFromURL ? parseInt(pageFromURL) - 1 : 0;
  const [pageIndex, setPageIndex] = React.useState<number>(initialPageIndex);
  const [pageSize, setPageSize] = React.useState<number>(10);

  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = React.useState<string>("");

  const { toast } = useToast();

  const [deleteCategoryId, setDeleteCategoryId] = React.useState<number | null>(null);
  const [isAlertDialogOpen, setAlertDialogOpen] = React.useState(false);
  const handleDeleteCategory = async () => {
    if (deleteCategoryId !== null) {
      try {
        await deleteCategory(deleteCategoryId);
        toast({
          variant: "success",
          description: "Categoría eliminada con éxito",
        });
        setAlertDialogOpen(false);
      } catch (error) {
        console.error("Error al eliminar la categoría:", error);
        setAlertDialogOpen(false);
      }
    }
  };

  const openAlertDialog = (id: number) => {
    setDeleteCategoryId(id);
    setAlertDialogOpen(true);
  };

  React.useEffect(() => {
    loadCategories();
  }, [searchTerm, pageIndex]);

  React.useEffect(() => {
    const searchParams = new URLSearchParams();
    if (searchTerm) searchParams.set("search", searchTerm);
    router.push(`/dashboard/categories?page=${pageIndex + 1}&${searchParams.toString()}`);
  }, [searchTerm, pageIndex]);

  const loadCategories = async () => {
    try {

      await getPaginatedCategories(pageIndex + 1, pageSize, searchTerm);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "image",
      header: "Imagen",
      cell: ({ row }) => (
        <div className="table-cell">
          <img
            alt="Imagen categoria"
            className="aspect-square rounded-md object-cover"
            height="64"
            src={row.getValue("image")}
            width="64"
          />
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const category = row.original

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
              <DropdownMenuItem onClick={() => window.location.href = `/dashboard/categories/edit/${category.slug}`}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openAlertDialog(category.id)}>
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
    data: categories || [],
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
            <AlertDialogTitle>¿Estás seguro de que deseas eliminar esta categoría?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La categoría se eliminará permanentemente.
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
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Categorias</BreadcrumbPage>
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
                <Button size="sm" className="h-7 gap-1" onClick={() => window.location.href = "/dashboard/categories/add"}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Agregar categoria
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
