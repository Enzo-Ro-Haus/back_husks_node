// src/services/usuarioDireccion.service.ts
import prisma from "../models/usuarioDireccion/usuarioDireccion";
import { IUsuarioDireccion } from "../models/usuarioDireccion/usuarioDireccion.interface";

/**
 * Para crear la relación usuario–dirección necesitas:
 * - data.usuarioId (number)
 * - data.direccionId (number)
 */
export const createUsuarioDireccionService = async (data: {
  usuarioId: number;
  direccionId: number;
}) => {
  return prisma.create({
    data: {
      usuario: { connect: { id: data.usuarioId } },
      direccion: { connect: { id: data.direccionId } },
    },
    include: {
      usuario: true,
      direccion: true,
    },
  });
};

export const getAllUsuarioDireccionesService = async () => {
  return prisma.findMany({
    include: {
      usuario: true,
      direccion: true,
    },
  });
};

export const getUsuarioDireccionByIdService = async (id: number) => {
  return prisma.findUnique({
    where: { id },
    include: {
      usuario: true,
      direccion: true,
    },
  });
};

/**
 * Para actualizar la relación, puedes cambiar usuarioId y/o direccionId
 */
export const updateUsuarioDireccionService = async (
  id: number,
  data: Partial<{ usuarioId: number; direccionId: number }>
) => {
  const updateData: any = {};
  if (data.usuarioId) {
    updateData.usuario = { connect: { id: data.usuarioId } };
  }
  if (data.direccionId) {
    updateData.direccion = { connect: { id: data.direccionId } };
  }

  return prisma.update({
    where: { id },
    data: updateData,
    include: {
      usuario: true,
      direccion: true,
    },
  });
};

export const deleteUsuarioDireccionService = async (id: number) => {
  return prisma.delete({ where: { id } });
};
