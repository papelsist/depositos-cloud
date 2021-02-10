import { Autorizacion } from './autorizacion';
import { Banco } from './banco';
import { Cliente } from './cliente';
import { CuentaDeBanco } from './cuenta-de-banco';
import { Sucursal } from './sucursal';
import firebase from 'firebase/app';
import { User } from './user';

export interface SolicitudDeDeposito {
  id: string;
  folio: number;
  sucursal?: Partial<Sucursal>;
  fecha: string;
  cliente: Partial<Cliente>;
  banco: Partial<Banco>;
  cuenta: Partial<CuentaDeBanco>;
  solicita: string;
  fechaDeposito: string;
  referencia: string;
  transferencia: number;
  efectivo: number;
  cheque: number;
  sbc: boolean;
  total: number;
  dateCreated?: string;
  lastUpdated?: string;
  createUser: Partial<User>;
  updateUser?: string;
  autorizacion?: Autorizacion;
  status: 'PENDIENTE' | 'AUTORIZADO' | 'RECHAZADO';
}
