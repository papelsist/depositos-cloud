import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';
import { initSdk } from './init';
// import { getFolio } from './folios';

// admin.initializeApp();
initSdk();
// const firestore = getDatabase();

export const onSolicitudCreate = functions.firestore
  .document('solicitudes/{solicitudId}')
  .onCreate(async (snap, context) => {
    return Promise.resolve();
  });
