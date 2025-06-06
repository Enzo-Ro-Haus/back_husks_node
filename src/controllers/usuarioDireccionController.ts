import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); 

export const createUsuarioDireccion = async (req: Request, res: Response): Promise<void> => {
    try {
        const { usuarioId, direccionId } = req.body;
        
        if (!usuarioId) {
            res.status(400).json({ message: 'El ID de usuario es obligatorio' });
            return;
        }
        if (!direccionId) {
            res.status(400).json({ message: 'El ID de dirección es obligatorio' });
            return;
        }
        
        const usuarioDireccion = await prisma.usuarioDireccion.create({
            data: {
                usuario: { connect: { id: usuarioId } },
                direccion: { connect: { id: direccionId } }
            },
            include: {
                usuario: true,
                direccion: true
            }
        });
        
        res.status(201).json(usuarioDireccion);
    } catch (error: any) {
        if (error?.code === 'P2002') {
            res.status(400).json({ message: 'La relación usuario-dirección ya existe' });
        } else if (error?.code === 'P2003') {
            res.status(400).json({ message: 'Usuario o dirección no encontrado' });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};

export const getAllUsuarioDirecciones = async (req: Request, res: Response): Promise<void> => {
    try {
        const usuarioDirecciones = await prisma.usuarioDireccion.findMany({
            include: {
                usuario: true,
                direccion: true
            }
        });
        res.status(200).json(usuarioDirecciones);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};

export const getUsuarioDireccionById = async (req: Request, res: Response): Promise<void> => {
    const usuarioDireccionId = parseInt(req.params.id);
    try {
        const usuarioDireccion = await prisma.usuarioDireccion.findUnique({
            where: { id: usuarioDireccionId },
            include: {
                usuario: true,
                direccion: true
            }
        });
        
        if (!usuarioDireccion) {
            res.status(404).json({ error: 'Relación usuario-dirección no encontrada' });
            return;
        }
        
        res.status(200).json(usuarioDireccion);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};

export const updateUsuarioDireccion = async (req: Request, res: Response): Promise<void> => {
    const usuarioDireccionId = parseInt(req.params.id);
    const { usuarioId, direccionId } = req.body;
    
    try {
        const dataToUpdate: any = {};
        if (usuarioId) dataToUpdate.usuario = { connect: { id: usuarioId } };
        if (direccionId) dataToUpdate.direccion = { connect: { id: direccionId } };
        
        const usuarioDireccion = await prisma.usuarioDireccion.update({
            where: { id: usuarioDireccionId },
            data: dataToUpdate,
            include: {
                usuario: true,
                direccion: true
            }
        });
        
        res.status(200).json(usuarioDireccion);
    } catch (error: any) {
        if (error?.code === 'P2002') {
            res.status(400).json({ error: 'La combinación usuario-dirección ya existe' });
        } else if (error?.code === 'P2003') {
            res.status(400).json({ error: 'Usuario o dirección no encontrado' });
        } else if (error?.code === 'P2025') {
            res.status(404).json('Relación usuario-dirección no encontrada');
        } else {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};

export const deleteUsuarioDireccion = async (req: Request, res: Response): Promise<void> => {
    const usuarioDireccionId = parseInt(req.params.id);
    
    try {
        await prisma.usuarioDireccion.delete({
            where: { id: usuarioDireccionId }
        });
        
        res.status(200).json({
            message: `Relación usuario-dirección ${usuarioDireccionId} eliminada correctamente`
        });
    } catch (error: any) {
        if (error?.code === 'P2025') {
            res.status(404).json('Relación usuario-dirección no encontrada');
        } else {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};