import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

admin.initializeApp();
const firestore = admin.firestore();

import { sucursales, bancos, users } from './data';

export const importSucursales = functions.https.onRequest(async (req, res) => {
  sucursales.forEach(async (item) => {
    console.log('Adding sucursal: ', item);
    const nombre = item.nombre.replace(/\s/g, '');
    const payload = { ...item, nombre };
    const res = await firestore
      .collection('sucursales')
      .doc(item.id)
      .set(payload);
    functions.logger.info('Sucursal updated: ', res.writeTime.toDate());
  });
  res.send(sucursales);
});

export const importarBancos = functions.https.onRequest(async (req, res) => {
  bancos.forEach(async (b) => {
    const res = await firestore.collection('bancos').doc(b.id).set(b);
    functions.logger.info('Banco updated: ', res.writeTime.toDate());
  });
  res.send(bancos);
});

export const importarUsuarios = functions.https.onRequest(async (req, res) => {
  users.forEach(async (b) => {
    /* TO DELETE ENTIRE COLLECTION */
    const collectionRef = firestore.collection('users');
    const snapshot = await collectionRef.get();
    const batch = firestore.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    const res = await firestore.collection('users').doc(b.uid).set(b);
    functions.logger.info('User updated: ', res.writeTime.toDate());
  });
  res.send(users);
});

export const importarEmpleados = () => {
  return functions.https.onRequest(async (request, response) => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((json) => {
        console.log('First user in the array:');
        console.log(json[0]);
        console.log('Name of the first user in the array:');
        console.log(json[0].name);
        response.json(json);
      })
      .catch((error) => response.status(500).send(error));
  });
};