// Talle.interface.ts
import { IBase } from "../Base.interface";
import { SistemaTalleEnum } from "../../enums/SistemaTalleEnum";

export interface ITalle extends IBase {
  sistema: SistemaTalleEnum;         // Enum
  valor: string;
}