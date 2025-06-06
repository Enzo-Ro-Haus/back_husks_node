import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); 

export const createDireccion = async (req: Request, res: Response): Promise<void> => {
    try {
        const { calle, localidad, cp } = req.body;
        
        if (!calle) {
            res.status(400).json({ message: 'La calle es obligatoria' });
            return;
        }
        if (!localidad) {
            res.status(400).json({ message: 'La localidad es obligatoria' });
            return;
        }
        if (!cp) {
            res.status(400).json({ message: 'El código postal es obligatorio' });
            return;
        }
        
        const direccion = await prisma.direccion.create({
            data: { calle, localidad, cp }
        });
        
        res.status(201).json(direccion);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};

export const getAllDirecciones = async (req: Request, res: Response): Promise<void> => {
    try {
        const direcciones = await prisma.direccion.findMany();
        res.status(200).json(direcciones);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};

export const getDireccionById = async (req: Request, res: Response): Promise<void> => {
    const direccionId = parseInt(req.params.id);
    try {
        const direccion = await prisma.direccion.findUnique({
            where: { id: direccionId }
        });
        
        if (!direccion) {
            res.status(404).json({ error: 'Dirección no encontrada' });
            return;
        }
        
        res.status(200).json(direccion);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};

export const updateDireccion = async (req: Request, res: Response): Promise<void> => {
    const direccionId = parseInt(req.params.id);
    const { calle, localidad, cp } = req.body;
    
    try {
        const direccion = await prisma.direccion.update({
            where: { id: direccionId },
            data: { calle, localidad, cp }
        });
        
        res.status(200).json(direccion);
    } catch (error: any) {
        if (error?.code === 'P2025') {
            res.status(404).json('Dirección no encontrada');
        } else {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};

export const deleteDireccion = async (req: Request, res: Response): Promise<void> => {
    const direccionId = parseInt(req.params.id);
    
    try {
        await prisma.direccion.delete({
            where: { id: direccionId }
        });
        
        res.status(200).json({
            message: `Dirección ${direccionId} eliminada correctamente`
        });
    } catch (error: any) {
        if (error?.code === 'P2025') {
            res.status(404).json('Dirección no encontrada');
        } else {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};