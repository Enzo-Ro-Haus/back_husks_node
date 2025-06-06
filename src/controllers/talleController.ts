import { Request, Response } from "express";
import { PrismaClient, SistemaTalleEnum } from '@prisma/client';
const prisma = new PrismaClient(); 


export const createTalle = async (req: Request, res: Response): Promise<void> => {
    try {
        const { sistema, valor } = req.body;
        
        if (!sistema || !Object.values(SistemaTalleEnum).includes(sistema)) {
            res.status(400).json({ message: 'Sistema de talle inválido' });
            return;
        }
        if (!valor) {
            res.status(400).json({ message: 'El valor es obligatorio' });
            return;
        }
        
        const talle = await prisma.talle.create({
            data: { sistema, valor }
        });
        
        res.status(201).json(talle);
    } catch (error: any) {
        if (error?.code === 'P2002') {
            res.status(400).json({ message: 'La combinación sistema/valor ya existe' });
        } else {
            console.error(error);
            res.status(500).json({ error: 'createTalle: Hubo un error, pruebe más tarde' });
        }
    }
};

export const getAllTalles = async (req: Request, res: Response): Promise<void> => {
    try {
        const talles = await prisma.talle.findMany();
        res.status(200).json(talles);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'getAllTalles Hubo un error, pruebe más tarde' });
    }
};

export const getTalleById = async (req: Request, res: Response): Promise<void> => {
    const talleId = parseInt(req.params.id);
    try {
        const talle = await prisma.talle.findUnique({
            where: { id: talleId }
        });
        
        if (!talle) {
            res.status(404).json({ error: 'Talle no encontrado' });
            return;
        }
        
        res.status(200).json(talle);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'getTalleById Hubo un error, pruebe más tarde' });
    }
};

export const updateTalle = async (req: Request, res: Response): Promise<void> => {
    const talleId = parseInt(req.params.id);
    const { sistema, valor } = req.body;
    
    try {
        const talle = await prisma.talle.update({
            where: { id: talleId },
            data: { sistema, valor }
        });
        
        res.status(200).json(talle);
    } catch (error: any) {
        if (error?.code === 'P2002') {
            res.status(400).json({ error: 'La combinación sistema/valor ya existe' });
        } else if (error?.code === 'P2025') {
            res.status(404).json('Talle no encontrado');
        } else {
            console.error(error);
            res.status(500).json({ error: 'updateTalle Hubo un error, pruebe más tarde' });
        }
    }
};

export const deleteTalle = async (req: Request, res: Response): Promise<void> => {
    const talleId = parseInt(req.params.id);
    
    try {
        await prisma.talle.delete({
            where: { id: talleId }
        });
        
        res.status(200).json({
            message: `Talle ${talleId} eliminado correctamente`
        });
    } catch (error: any) {
        if (error?.code === 'P2025') {
            res.status(404).json('Talle no encontrado');
        } else {
            console.error(error);
            res.status(500).json({ error: 'deleteTalle Hubo un error, pruebe más tarde' });
        }
    }
};