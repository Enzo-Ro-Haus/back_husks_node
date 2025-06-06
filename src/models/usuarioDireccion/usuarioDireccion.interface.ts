// UsuarioDireccion.interface.ts
import { IBase } from "../Base.interface";
import { IUsuario } from "../usuario//usuario.inteface";
import { IDireccion } from "../direccion/direccion.interface";

export interface IUsuarioDireccion extends IBase {
  usuario: IUsuario;             // Relación ManyToOne
  direccion: IDireccion;         // Relación ManyToOne
}
