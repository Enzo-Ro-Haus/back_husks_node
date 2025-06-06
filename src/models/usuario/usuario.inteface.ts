import { RolEnum } from "../../enums/RolEnum"
import { IBase } from "../Base.interface"
import { IDireccion } from "../direccion/direccion.interface";
import { IOrdenDeCompra } from "../ordenDeCompra/ordenDeCompra.interface";

export interface IUsuario extends IBase {
    nombre: String;
    email: String;
    password: String;
    rol: RolEnum;
    direcciones?: IDireccion[];
    ordenes?: IOrdenDeCompra[];
}