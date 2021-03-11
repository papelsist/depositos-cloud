import { UserInfo } from './user';
import firebase from 'firebase/app';

export interface Autorizacion {
  user: Partial<UserInfo>;
  fecha: string;
  tipo: TipoDeAutorizacion;
  autorizo?: string;
  comentario?: string;
}

export type TipoDeAutorizacion =
  | 'TRANSACCION_BANCARIA'
  | 'VENTA_SIN_EXISTENCIA';

export interface AutorizacionRechazo {
  uid: string;
  userName: string;
  tipo?: string;
  motivo: string;
  comentario?: string;
  dateCreated?: firebase.firestore.Timestamp;
}
