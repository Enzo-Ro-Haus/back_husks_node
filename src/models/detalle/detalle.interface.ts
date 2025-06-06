import { IBase } from "../Base.interface";
import { IOrdenDeCompra } from "../ordenDeCompra/ordenDeCompra.interface";
import { IProducto } from "../producto/producto.interface";

export interface IDetalle extends IBase {
  ordenDeCompra: IOrdenDeCompra; // Relación ManyToOne
  producto: IProducto;           // Relación ManyToOne
  cantidad: number;
}