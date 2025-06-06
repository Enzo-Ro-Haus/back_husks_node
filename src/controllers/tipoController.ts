import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); 

export const createTipo = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre } = req.body;
        if (!nombre) {
            res.status(400).json({ message: 'El nombre es obligatorio' });
            return;
        }
        
        const tipo = await prisma.tipo.create({
            data: { nombre }
        });
        
        res.status(201).json(tipo);
    } catch (error: any) {
        if (error?.code === 'P2002') {
            res.status(400).json({ message: 'El nombre de tipo ya existe' });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};

export const getAllTipos = async (req: Request, res: Response): Promise<void> => {
    try {
        const tipos = await prisma.tipo.findMany();
        res.status(200).json(tipos);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};

export const getTipoById = async (req: Request, res: Response): Promise<void> => {
    const tipoId = parseInt(req.params.id);
    try {
        const tipo = await prisma.tipo.findUnique({
            where: { id: tipoId }
        });
        
        if (!tipo) {
            res.status(404).json({ error: 'Tipo no encontrado' });
            return;
        }
        
        res.status(200).json(tipo);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};

export const updateTipo = async (req: Request, res: Response): Promise<void> => {
    const tipoId = parseInt(req.params.id);
    const { nombre } = req.body;
    
    try {
        const tipo = await prisma.tipo.update({
            where: { id: tipoId },
            data: { nombre }
        });
        
        res.status(200).json(tipo);
    } catch (error: any) {
        if (error?.code === 'P2002') {
            res.status(400).json({ error: 'El nombre de tipo ya existe' });
        } else if (error?.code === 'P2025') {
            res.status(404).json('Tipo no encontrado');
        } else {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};

export const deleteTipo = async (req: Request, res: Response): Promise<void> => {
    const tipoId = parseInt(req.params.id);
    
    try {
        await prisma.tipo.delete({
            where: { id: tipoId }
        });
        
        res.status(200).json({
            message: `Tipo ${tipoId} eliminado correctamente`
        });
    } catch (error: any) {
        if (error?.code === 'P2025') {
            res.status(404).json('Tipo no encontrado');
        } else {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};