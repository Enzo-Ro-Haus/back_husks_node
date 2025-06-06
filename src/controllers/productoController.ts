import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); 
import { Decimal } from '@prisma/client/runtime/library';

export const createProducto = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre, precio, cantidad, descripcion, color, categoriaId, tallesIds } = req.body;
        
        // Validaciones básicas
        if (!nombre) {
            res.status(400).json({ message: 'El nombre es obligatorio' });
            return;
        }
        if (precio === undefined || precio <= 0) {
            res.status(400).json({ message: 'El precio debe ser un número positivo' });
            return;
        }
        if (!categoriaId) {
            res.status(400).json({ message: 'La categoría es obligatoria' });
            return;
        }

        // Convertir precio a Decimal
        const precioDecimal = new Decimal(precio);
        
        // Crear producto con relaciones
        const product = await prisma.producto.create({
            data: {
                nombre,
                precio: precioDecimal,
                cantidad: cantidad || 0,
                descripcion: descripcion || null,
                color: color || null,
                categoria: {
                    connect: { id: categoriaId }
                },
                tallesDisponibles: {
                    create: (tallesIds || []).map((talleId: number) => ({
                        talle: { connect: { id: talleId } },
                        stock: cantidad || 0 // Stock inicial
                    }))
                }
            },
            include: {
                categoria: true,
                tallesDisponibles: {
                    include: {
                        talle: true
                    }
                }
            }
        });

        res.status(201).json(product);
    } catch (error: any) {
        if (error?.code === 'P2002') {
            res.status(400).json({ message: 'El nombre del producto ya existe' });
        } else if (error?.code === 'P2003') {
            res.status(400).json({ message: 'Categoría o talle no encontrado' });
        } else {
            console.error('Error creando producto:', error);
            res.status(500).json({ error:  'createProducto Hubo un error, pruebe más tarde' });
        }
    }
};

export const getAllProductos = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await prisma.producto.findMany({
            include: {
                categoria: true,
                tallesDisponibles: {
                    include: {
                        talle: true
                    }
                }
            }
        });
        
        res.status(200).json(products);
    } catch (error: any) {
        console.error('Error obteniendo productos:', error);
        res.status(500).json({ error: 'getAllProducto Hubo un error, pruebe más tarde' });
    }
};

export const getProductoById = async (req: Request, res: Response): Promise<void> => {
    const productId = parseInt(req.params.id);
    try {
        const product = await prisma.producto.findUnique({
            where: { id: productId },
            include: {
                categoria: true,
                tallesDisponibles: {
                    include: {
                        talle: true
                    }
                }
            }
        });
        
        if (!product) {
            res.status(404).json({ error: 'Producto no encontrado' });
            return;
        }
        
        res.status(200).json(product);
    } catch (error: any) {
        console.error('Error obteniendo producto:', error);
        res.status(500).json({ error: 'getByIdProducto Hubo un error, pruebe más tarde' });
    }
};

export const updateProducto = async (req: Request, res: Response): Promise<void> => {
    const productId = parseInt(req.params.id);
    const { nombre, precio, cantidad, descripcion, color, categoriaId, tallesIds } = req.body;

    try {
        let dataToUpdate: any = {
            nombre,
            precio: precio !== undefined ? new Decimal(precio) : undefined,
            cantidad,
            descripcion: descripcion !== undefined ? descripcion : undefined,
            color: color !== undefined ? color : undefined
        };

        // Actualizar categoría si se proporciona
        if (categoriaId) {
            dataToUpdate.categoria = { connect: { id: categoriaId } };
        }

        // Manejar actualización de talles
        if (Array.isArray(tallesIds)) {
            // Eliminar relaciones existentes
            await prisma.talleProducto.deleteMany({
                where: { productoId: productId }
            });
            
            // Crear nuevas relaciones
            dataToUpdate.tallesDisponibles = {
                create: tallesIds.map((talleId: number) => ({
                    talle: { connect: { id: talleId } },
                    stock: cantidad || 0 // Actualizar stock con nueva cantidad
                }))
            };
        }

        const updatedProduct = await prisma.producto.update({
            where: { id: productId },
            data: dataToUpdate,
            include: {
                categoria: true,
                tallesDisponibles: {
                    include: {
                        talle: true
                    }
                }
            }
        });

        res.status(200).json(updatedProduct);
    } catch (error: any) {
        if (error?.code === 'P2002') {
            res.status(400).json({ error: 'El nombre del producto ya existe' });
        } else if (error?.code === 'P2025') {
            res.status(404).json({ error: 'Producto no encontrado' });
        } else if (error?.code === 'P2003') {
            res.status(400).json({ error: 'Categoría o talle no encontrado' });
        } else {
            console.error('Error actualizando producto:', error);
            res.status(500).json({ error: 'updateProducto Hubo un error, pruebe más tarde' });
        }
    }
};

export const deleteProducto = async (req: Request, res: Response): Promise<void> => {
    const productId = parseInt(req.params.id);
    try {
        // Eliminar relaciones en tabla intermedia primero
        await prisma.talleProducto.deleteMany({
            where: { productId }
        });
        
        // Eliminar el producto
        await prisma.producto.delete({
            where: { id: productId }
        });

        res.status(200).json({
            message: `Producto ${productId} eliminado correctamente`
        });
    } catch (error: any) {
        if (error?.code === 'P2025') {
            res.status(404).json({ error: 'Producto no encontrado' });
        } else {
            console.error('Error eliminando producto:', error);
            res.status(500).json({ error: 'deleteProducto Hubo un error, pruebe más tarde' });
        }
    }
};