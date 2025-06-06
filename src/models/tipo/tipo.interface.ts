// Tipo.interface.ts
import { IBase } from "../Base.interface";
import { ICategoria } from "../categoria/categoria.interface"

export interface ITipo extends IBase {
  nombre: string;
  categorias: ICategoria[];      // Relación OneToMany
}