/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// import { initSdk } from './init';
// import { getFolio } from './folios';

admin.initializeApp();
// initSdk();
// const firestore = getDatabase();

exports.addRole = functions.https.onCall((data, context) => {
  if (!context.auth?.token?.papxAdmin !== true) {
    return {
      error: 'Request not authorized',
    };
  }
  const { email, role } = data;
  return grantRole(email, role);
});

async function grantRole(email: string, _role: string) {
  const user = await admin.auth().getUserByEmail(email);
  if (user.customClaims && (user.customClaims as any)[_role] === true) {
    return;
  }
  const cl: { [key: string]: boolean } = {};
  cl[`${_role}`] = true;
  return admin.auth().setCustomUserClaims(user.uid, cl);
}

export const onSolicitudCreate = functions.firestore
  .document('solicitudes/{solicitudId}')
  .onCreate(async (snap, context) => {
    return Promise.resolve();
  });
