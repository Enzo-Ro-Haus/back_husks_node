// Producto.interface.ts
import { IBase } from "../Base.interface";
import { ICategoria } from "../categoria/categoria.interface";
import { ITalle } from "../talle/talle.interface";

export interface IProducto extends IBase {
  nombre: string;
  precio: number;                // BigDecimal -> number
  cantidad: number;
  descripcion?: string;          // Opcional (nullable en Java)
  color?: string;                // Opcional (nullable en Java)
  categoria: ICategoria;         // Relación ManyToOne
  tallesDisponibles: ITalle[];   // Relación ManyToMany
}