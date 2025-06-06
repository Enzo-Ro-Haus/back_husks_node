import { Request, Response } from "express";
import { hashPassword } from "../services/passwordService";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre, email, password, rol } = req.body
        if (!email) {
            res.status(400).json({ message: 'El email es obligatorio' })
            return
        }
        if (!password) {
            res.status(400).json({ message: 'El password es obligatorio' })
            return
        }

        if (!rol) {
            res.status(400).json({ message: "El rol es obligatorio" });
            return;
        }

        const hashedPassword = await hashPassword(password)
        const user = await prisma.usuario.create(
            {
                data: {
                    nombre: nombre,
                    email: email,
                    password: hashedPassword,
                    rol
                }
            }
        )
        res.status(201).json(user)
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ message: 'El mail ingresado ya existe' })
        }
        console.log(error)
        res.status(500).json({ error: 'createUser: Hubo un error, pruebe más tarde' })
    }
}

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.usuario.findMany()
        res.status(200).json(users);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'getAllUsers: Hubo un error, pruebe más tarde' })
    }
}

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id)
    try {
        const user = await prisma.usuario.findUnique({
            where: {
                id: userId
            }
        })
        if (!user) {
            res.status(404).json({ error: 'El usuario no fue encontrado' })
            return
        }
        res.status(200).json(user)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'getUserById: Hubo un error, pruebe más tarde' })
    }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id)
    const { email, password } = req.body
    try {

        let dataToUpdate: any = { ...req.body }

        if (password) {
            const hashedPassword = await hashPassword(password)
            dataToUpdate.password = hashedPassword
        }

        if (email) {
            dataToUpdate.email = email
        }

        const user = await prisma.usuario.update({
            where: {
                id: userId
            },
            data: dataToUpdate
        })

        res.status(200).json(user)
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ error: 'El email ingresado ya existe' })
        } else if (error?.code == 'P2025') {
            res.status(404).json('Usuario no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'updateUser: Hubo un error, pruebe más tarde' })
        }
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id)
    try {
        await prisma.usuario.delete({
            where: {
                id: userId
            }
        })

        res.status(200).json({
            message: `El usuario ${userId} ha sido eliminado`
        }).end()

    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('Usuario no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'deleteUser: Hubo un error, pruebe más tarde' })
        }
    }
}
