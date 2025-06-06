// src/services/categoria.service.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); 
import { ICategoria } from "../models/categoria/categoria.interface";

export const createCategoriaService = async (data: Partial<ICategoria>) => {
  return prisma.create({ data: { nombre: data.nombre! } });
};

export const getAllCategoriasService = async () => {
  return prisma.findMany();
};

export const getCategoriaByIdService = async (id: number) => {
  return prisma.findUnique({ where: { id } });
};

export const updateCategoriaService = async (
  id: number,
  data: Partial<ICategoria>
) => {
  return prisma.update({ where: { id }, data: { nombre: data.nombre! } });
};

export const deleteCategoriaService = async (id: number) => {
  return prisma.delete({ where: { id } });
};
