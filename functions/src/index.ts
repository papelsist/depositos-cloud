import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const firestore = admin.firestore();

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

export const onCreateUser = functions.auth.user().onCreate((user) => {
  functions.logger.info('User created: ', user);
  functions.logger.info('Localizar datos del empleado');
  return null;
});

const createNewUser = functions.https.onRequest((request, response) => {
  const payload = request.body;
  functions.logger.info('Payload: ', payload);
});

const createSiipapUser = functions.https.onCall((data, context) => {
  functions.logger.info('Registrando un nuevo usuario: ', data);
  return data;
});

exports.createNewUser = createNewUser;
exports.createSiipapUser = createSiipapUser;
