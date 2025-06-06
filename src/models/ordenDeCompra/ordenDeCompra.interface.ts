import { IBase } from "../Base.interface";
import { IUsuario } from "../usuario/usuario.inteface";
import { IUsuarioDireccion } from "../usuarioDireccion/usuarioDireccion.interface";
import { IDetalle } from "../detalle/detalle.interface"; 
import { EstadoOrdenEnum } from "../../enums/EstadoOrdenEnum";
import { MetodoPagoEnum } from "../../enums/MetodoPagoEnum";

export interface IOrdenDeCompra extends IBase {
  usuario: IUsuario;             // Relación ManyToOne
  usuarioDireccion: IUsuarioDireccion; // Relación ManyToOne
  fecha: Date;
  precioTotal: number;           // BigDecimal -> number
  metodoPago: MetodoPagoEnum;        // Enum
  estado: EstadoOrdenEnum;           // Enum
  detalles: IDetalle[];          // Relación OneToMany
}