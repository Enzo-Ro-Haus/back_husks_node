import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); 

export const createCategoria = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre } = req.body;
        if (!nombre) {
            res.status(400).json({ message: 'El nombre es obligatorio' });
            return;
        }
        
        const categoria = await prisma.categoria.create({
            data: {
                nombre
            }
        });
        
        res.status(201).json(categoria);
    } catch (error: any) {
        if (error?.code === 'P2002') {
            res.status(400).json({ message: 'El nombre de categoría ya existe' });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};

export const getAllCategorias = async (req: Request, res: Response): Promise<void> => {
    try {
        const categorias = await prisma.categoria.findMany();
        res.status(200).json(categorias);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};

export const getCategoriaById = async (req: Request, res: Response): Promise<void> => {
    const categoriaId = parseInt(req.params.id);
    try {
        const categoria = await prisma.categoria.findUnique({
            where: { id: categoriaId }
        });
        
        if (!categoria) {
            res.status(404).json({ error: 'Categoría no encontrada' });
            return;
        }
        
        res.status(200).json(categoria);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
    }
};

export const updateCategoria = async (req: Request, res: Response): Promise<void> => {
    const categoriaId = parseInt(req.params.id);
    const { nombre } = req.body;
    
    try {
        const categoria = await prisma.categoria.update({
            where: { id: categoriaId },
            data: { nombre }
        });
        
        res.status(200).json(categoria);
    } catch (error: any) {
        if (error?.code === 'P2002') {
            res.status(400).json({ error: 'El nombre de categoría ya existe' });
        } else if (error?.code === 'P2025') {
            res.status(404).json('Categoría no encontrada');
        } else {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};

export const deleteCategoria = async (req: Request, res: Response): Promise<void> => {
    const categoriaId = parseInt(req.params.id);
    
    try {
        await prisma.categoria.delete({
            where: { id: categoriaId }
        });
        
        res.status(200).json({
            message: `Categoría ${categoriaId} eliminada correctamente`
        });
    } catch (error: any) {
        if (error?.code === 'P2025') {
            res.status(404).json('Categoría no encontrada');
        } else {
            console.error(error);
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' });
        }
    }
};