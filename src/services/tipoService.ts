// src/services/tipo.service.ts
import prisma from "../models/tipo/tipo";
import { ITipo } from "../models/tipo/tipo.interface";

export const createTipoService = async (data: Partial<ITipo>) => {
  return prisma.create({ data: { nombre: data.nombre! } });
};

export const getAllTiposService = async () => {
  return prisma.findMany();
};

export const getTipoByIdService = async (id: number) => {
  return prisma.findUnique({ where: { id } });
};

export const updateTipoService = async (id: number, data: Partial<ITipo>) => {
  return prisma.update({ where: { id }, data: { nombre: data.nombre! } });
};

export const deleteTipoService = async (id: number) => {
  return prisma.delete({ where: { id } });
};
