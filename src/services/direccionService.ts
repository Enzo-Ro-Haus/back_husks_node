// src/services/direccion.service.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); 
import { IDireccion } from "../models/direccion/direccion.interface";

export const createDireccionService = async (data: Partial<IDireccion>) => {
  return prisma.create({ data });
};

export const getAllDireccionesService = async () => {
  return prisma.findMany();
};

export const getDireccionByIdService = async (id: number) => {
  return prisma.findUnique({ where: { id } });
};

export const updateDireccionService = async (
  id: number,
  data: Partial<IDireccion>
) => {
  return prisma.update({ where: { id }, data });
};

export const deleteDireccionService = async (id: number) => {
  return prisma.delete({ where: { id } });
};
