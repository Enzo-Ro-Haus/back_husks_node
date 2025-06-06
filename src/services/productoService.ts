// src/services/producto.service.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); 
import { Decimal } from "@prisma/client/runtime/library";
import { IProducto } from "../models/producto/producto.interface";

/**
 * Para crear un producto con categoría y tallesDisponibles necesitas:
 * - data.nombre
 * - data.precio (número)
 * - data.cantidad (número)
 * - data.descripcion? (string)
 * - data.color? (string)
 * - data.categoriaId (number)
 * - data.tallesIds? (number[])
 */
export const createProductoService = async (
  data: Partial<IProducto> & {
    categoriaId: number;
    tallesIds?: number[];
  }
) => {
  const precioDecimal = new Decimal(data.precio!);

  return prisma.producto.create({
    data: {
      nombre: data.nombre!,
      precio: precioDecimal,
      cantidad: data.cantidad ?? 0,
      descripcion: data.descripcion ?? null,
      color: data.color ?? null,
      categoria: { connect: { id: data.categoriaId } },
      tallesDisponibles: {
        create: (data.tallesIds ?? []).map((talleId) => ({
          talle: { connect: { id: talleId } },
          stock: data.cantidad ?? 0,
        })),
      },
    },
    include: {
      categoria: true,
      tallesDisponibles: {
        include: {
          talle: true,
        },
      },
    },
  });
};

export const getAllProductosService = async () => {
  return prisma.producto.findMany({
    include: {
      categoria: true,
      tallesDisponibles: {
        include: {
          talle: true,
        },
      },
    },
  });
};

export const getProductoByIdService = async (id: number) => {
  return prisma.producto.findUnique({
    where: { id },
    include: {
      categoria: true,
      tallesDisponibles: {
        include: {
          talle: true,
        },
      },
    },
  });
};

/**
 * Para actualizar un producto puedes enviar:
 * - nombre? (string)
 * - precio? (número)
 * - cantidad? (número)
 * - descripcion? (string)
 * - color? (string)
 * - categoriaId? (number)
 * - tallesIds? (number[])
 */
export const updateProductoService = async (
  id: number,
  data: Partial<IProducto> & {
    categoriaId?: number;
    tallesIds?: number[];
  }
) => {
  // Primero, prepará el objeto base para actualizar
  const updateData: any = {
    nombre: data.nombre,
    precio: data.precio !== undefined ? new Decimal(data.precio) : undefined,
    cantidad: data.cantidad,
    descripcion: data.descripcion,
    color: data.color,
  };

  // Si cambia de categoría
  if (data.categoriaId) {
    updateData.categoria = { connect: { id: data.categoriaId } };
  }

  // Si vienen tallesIds, eliminamos relaciones actuales y creamos nuevas
  if (Array.isArray(data.tallesIds)) {
    // eliminamos todos los tallesDisponibles para este producto
    await prisma.talleProducto.deleteMany({
      where: { productoId: id },
    });

    // creamos las nuevas relaciones
    updateData.tallesDisponibles = {
      create: data.tallesIds.map((talleId) => ({
        talle: { connect: { id: talleId } },
        stock: data.cantidad ?? 0,
      })),
    };
  }

  return prisma.producto.update({
    where: { id },
    data: updateData,
    include: {
      categoria: true,
      tallesDisponibles: {
        include: { talle: true },
      },
    },
  });
};

export const deleteProductoService = async (id: number) => {
  // Primero eliminamos relaciones en la tabla intermedia
  await prisma.talleProducto.deleteMany({
    where: { productoId: id },
  });
  // Luego borramos el producto
  return prisma.producto.delete({ where: { id } });
};
