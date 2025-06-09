export interface JwtPayload {
  id: number;
  rol: string;
  email?: string;
  nombre?: string;
}