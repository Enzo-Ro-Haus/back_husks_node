import prisma from "../models/usuario/usuario";
import { IUsuario } from "../models/usuario/usuario.inteface";
import { hashPassword } from "./passwordService";

export const createUsuarioService = async (data: Partial<IUsuario>) => {
    const hashed = await hashPassword(data.password!);
    return prisma.create({ data: { ...data, password: hashed } });
};

export const getAllUsuariosService = async () => {
    return prisma.findMany();
};

export const getUsuarioByIdService = async (id: number) => {
    return prisma.findUnique({ where: { id } });
};

export const updateUsuarioService = async (id: number, data: Partial<IUsuario>) => {
    if (data.password) {
        data.password = await hashPassword(data.password);
    }
    return prisma.update({ where: { id }, data });
};

export const deleteUsuarioService = async (id: number) => {
    return prisma.delete({ where: { id } });
};
