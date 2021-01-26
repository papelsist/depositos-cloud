export interface SolicitudDeDeposito {
  fecha: string | Date;
  nombre: string;
  transferencia: number;
  cheque: number;
  efectivo: number;
  total: number;
}
