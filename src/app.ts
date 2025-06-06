// src/app.ts
import dotenv from "dotenv";
dotenv.config();

import express from "express";

// TODO Cambiar nombre
import authRoutes from "../src/router/authRoutes";
import userRoutes from "../src/router/userRoutes";
import categoriaRoutes from "../src/router/categoriaRoutes";
import tipoRoutes from "../src/router/tipoRoutes";
import talleRoutes from "../src/router/talleRoutes";
import direccionRoutes from "../src/router/direccionRoutes";
import productoRoutes from "../src/router/productoRoutes";           // el router para órdenes ahí
import detalleRoutes from "../src/router/detalleRoutes";
import ordenDeCompraRoutes from "../src/router/ordenDeCompraRoutes";
import usuarioDireccionRoutes from "../src/router/usuarioDireccionRoutes";

const app = express();
app.use(express.json());

// RUTAS
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/categorias", categoriaRoutes);
app.use("/tipos", tipoRoutes);
app.use("/talles", talleRoutes);
app.use("/direcciones", direccionRoutes);
app.use("/productos", productoRoutes);
app.use("/detalles", detalleRoutes);
app.use("/ordenes", ordenDeCompraRoutes);
app.use("/usuario-direcciones", usuarioDireccionRoutes);

export default app;
