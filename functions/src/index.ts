import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { initSdk, getDatabase } from './init';
import { getFolio } from './folios';

// admin.initializeApp();
initSdk();
const firestore = getDatabase();

// const cors = require('cors')({
//   origin: true,
// });

export const getSucursales = functions.https.onRequest(async (req, res) => {
  functions.logger.info('Getting sucursales...');
  const snapshot = await firestore.collection('sucursales').get();
  const rows = snapshot.docs.map((doc) => doc.data());
  res.send(rows);
});

export const createSolicitudDeDeposito = functions.https.onCall(
  (data, context) => {
    functions.logger.log('Registrando solicitud de deposito');
    return { comentario: 'OK' };
  }
);

export const onCreateUser = functions.auth.user().onCreate(async (user) => {
  functions.logger.info('User created: ' + user.displayName);

  const usersRef = firestore.collection('users');
  const snapshot = await usersRef
    .where('email', '==', user.email)
    .limit(1)
    .get();
  if (!snapshot.empty) {
    const data = snapshot.docs[0].data();
    if (data) {
      const roles: string[] = data.roles || [];
      const croles = roles.map((item) => item.substr(5));
      const claims = croles.reduce((prev, curr) => {
        return { ...prev, [curr]: true };
      }, {});

      // const link = await admin
      //   .auth()
      //   .generateEmailVerificationLink(data.email, {
      //     url: 'http://localhost:8100',
      //     handleCodeInApp: false,
      //   });
      // functions.logger.log('Verefication link:' + link);
      return admin.auth().setCustomUserClaims(user.uid, claims);
    }
  }
  return null;
});

const createSiipapUser = functions.https.onCall(async (data, context) => {
  functions.logger.info('Registrando un nuevo usuario: ', data);
  const { email, password, displayName } = data;
  try {
    // Validar que exista el usuario de siipap registrado
    const usersRef = firestore.collection('users');
    const snapshot = await usersRef.where('email', '==', email).limit(1).get();
    if (snapshot.empty) {
      return new Promise((resolve, reject) => {
        reject(
          new functions.https.HttpsError(
            'not-found',
            `No existe empleado registrado con el email: ${email}`
          )
        );
      });
    }
    const uid = snapshot.docs[0].id;

    const user = await admin.auth().createUser({
      email,
      password,
      emailVerified: false,
      displayName,
      disabled: false,
      uid,
    });

    return user;
  } catch (error) {
    const code = error.code;
    let message = error.message;
    if (code === 'auth/email-already-exists') {
      message = 'Email ya registrado por otro usuario';
    }
    functions.logger.error(error.code, message);
    return new Promise((resolve, reject) => {
      reject(new functions.https.HttpsError('already-exists', message));
    });
  }
});

exports.createSiipapUser = createSiipapUser;

export const onSolicitudCreate = functions.firestore
  .document('solicitudes/{solicitudId}')
  .onCreate(async (snap, context) => {
    return getDatabase().runTransaction(async (transaction) => {
      const { sucursal } = snap.data();
      const command = {
        sucursal,
        transaction,
        db: getDatabase(),
        entidad: 'deposito-solicitud',
      };
      const folio = await getFolio(command);
      const FieldValue = admin.firestore.FieldValue;
      const payload = {
        folio,
        dateCreated: FieldValue.serverTimestamp(),
      };
      transaction.update(snap.ref, payload);
    });
  });
