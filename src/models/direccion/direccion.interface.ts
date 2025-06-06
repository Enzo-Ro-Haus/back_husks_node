// Direccion.interface.ts
import { IBase } from "../Base.interface";

export interface IDireccion extends IBase {
  calle: string;
  localidad: string;
  cp: string;
}
