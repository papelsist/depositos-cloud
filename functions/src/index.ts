/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const onSolicitudCreate = functions.firestore
  .document('solicitudes2/{solicitudId}')
  .onCreate(async (snap, context) => {
    functions.logger.info('Registrando nueva solicitud');

    // 1 - Update stats
    const summary = {
      pendientes: admin.firestore.FieldValue.increment(1),
    };
    const updateStats = admin
      .firestore()
      .collection('stats')
      .doc('solicitudes`')
      .set(summary, { merge: true });

    // 2 - Send notifications
    const notifications = sendSolicitudNotification(snap.data());
    return Promise.all([updateStats, notifications]);
  });

export const onSolicitudDelete = functions.firestore
  .document('solicitudes2/{solicitudId}')
  .onDelete((snap, context) => {
    const summary = { count: admin.firestore.FieldValue.increment(-1) };
    return admin
      .firestore()
      .collection('stats')
      .doc('solicitudes`')
      .set(summary, { merge: true });
  });

/*
async function sendNewSolicitudNotification(solicitud: any): Promise<string> {
  const notification: admin.messaging.Notification = {
    title: 'Nueva solicitud generada',
    body: 'Folio: ' + solicitud.folio || 'WHAT!!!',
  };
  const docRef = admin.firestore().doc('fcm/solicitudes-nuevas');
  const tokenSnap = await docRef.get();
  const token = tokenSnap.data()?.token;
  const payload: admin.messaging.Message = {
    notification,
    webpush: {
      notification: {
        vibrate: [200, 100, 200],
        actions: [
          {
            action: 'like',
            title: 'Good',
          },
          {
            action: 'dislike',
            title: 'Not good',
          },
        ],
      },
    },
    token,
  };
  functions.logger.info('Sending notification to: ', token);
  return admin.messaging().send(payload);
}
*/

const sendSolicitudNotification = functions.firestore
  .document('solicitudes2/{solicitudId}')
  .onCreate(async (snap, context) => {
    const solicitud = snap.data();
    const notification: admin.messaging.Notification = {
      title: 'Nueva solicitud generada',
      body: 'Folio: ' + solicitud.folio || 'WHAT!!!',
    };
    const docRef = admin.firestore().doc('fcm/solicitudes-nuevas');
    const tokenSnap = await docRef.get();
    const token = tokenSnap.data()?.token;
    const payload: admin.messaging.Message = {
      notification,
      webpush: {
        notification: {
          vibrate: [200, 100, 200],
          icon:
            'https://github.githubassets.com/images/modules/site/home/logos/platform-apple.svg',
          actions: [
            {
              action: 'like',
              title: 'Good',
            },
            {
              action: 'dislike',
              title: 'Not good',
            },
          ],
        },
      },
      token,
    };
    functions.logger.info('Sending notification to: ', token);
    return admin.messaging().send(payload);
  });
