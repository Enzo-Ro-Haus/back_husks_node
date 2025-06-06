// src/services/talle.service.ts
import prisma from "../models/talle/talle";
import { ITalle } from "../models/talle/talle.interface";

export const createTalleService = async (data: Partial<ITalle>) => {
  return prisma.create({ data: { sistema: data.sistema!, valor: data.valor! } });
};

export const getAllTallesService = async () => {
  return prisma.findMany();
};

export const getTalleByIdService = async (id: number) => {
  return prisma.findUnique({ where: { id } });
};

export const updateTalleService = async (id: number, data: Partial<ITalle>) => {
  return prisma.update({
    where: { id },
    data: { sistema: data.sistema!, valor: data.valor! },
  });
};

export const deleteTalleService = async (id: number) => {
  return prisma.delete({ where: { id } });
};
