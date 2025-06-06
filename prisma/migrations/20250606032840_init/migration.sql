-- CreateEnum
CREATE TYPE "RolEnum" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "MetodoPagoEnum" AS ENUM ('TARJETA_CREDITO', 'EFECTIVO');

-- CreateEnum
CREATE TYPE "EstadoOrdenEnum" AS ENUM ('PENDIENTE', 'ENVIADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "SistemaTalleEnum" AS ENUM ('EUROPA', 'USA');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "RolEnum" NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Direccion" (
    "id" SERIAL NOT NULL,
    "calle" TEXT NOT NULL,
    "localidad" TEXT NOT NULL,
    "cp" TEXT NOT NULL,

    CONSTRAINT "Direccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioDireccion" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "direccionId" INTEGER NOT NULL,

    CONSTRAINT "UsuarioDireccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tipo" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Tipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Talle" (
    "id" SERIAL NOT NULL,
    "sistema" "SistemaTalleEnum" NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "Talle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "producto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "descripcion" TEXT,
    "color" TEXT,
    "categoriaId" INTEGER NOT NULL,

    CONSTRAINT "producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "talle_producto" (
    "id" SERIAL NOT NULL,
    "productoId" INTEGER NOT NULL,
    "talleId" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,

    CONSTRAINT "talle_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orden_de_compra" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "usuarioDireccionId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "precioTotal" DECIMAL(10,2) NOT NULL,
    "metodoPago" "MetodoPagoEnum" NOT NULL,
    "estado" "EstadoOrdenEnum" NOT NULL,

    CONSTRAINT "orden_de_compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle" (
    "id" SERIAL NOT NULL,
    "ordenDeCompraId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "detalle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioDireccion_usuarioId_direccionId_key" ON "UsuarioDireccion"("usuarioId", "direccionId");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Tipo_nombre_key" ON "Tipo"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Talle_sistema_valor_key" ON "Talle"("sistema", "valor");

-- CreateIndex
CREATE UNIQUE INDEX "producto_nombre_key" ON "producto"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "talle_producto_productoId_talleId_key" ON "talle_producto"("productoId", "talleId");

-- AddForeignKey
ALTER TABLE "UsuarioDireccion" ADD CONSTRAINT "UsuarioDireccion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioDireccion" ADD CONSTRAINT "UsuarioDireccion_direccionId_fkey" FOREIGN KEY ("direccionId") REFERENCES "Direccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto" ADD CONSTRAINT "producto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talle_producto" ADD CONSTRAINT "talle_producto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "talle_producto" ADD CONSTRAINT "talle_producto_talleId_fkey" FOREIGN KEY ("talleId") REFERENCES "Talle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orden_de_compra" ADD CONSTRAINT "orden_de_compra_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orden_de_compra" ADD CONSTRAINT "orden_de_compra_usuarioDireccionId_fkey" FOREIGN KEY ("usuarioDireccionId") REFERENCES "UsuarioDireccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle" ADD CONSTRAINT "detalle_ordenDeCompraId_fkey" FOREIGN KEY ("ordenDeCompraId") REFERENCES "orden_de_compra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle" ADD CONSTRAINT "detalle_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
