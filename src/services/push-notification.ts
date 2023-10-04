// import firebaseAdmin from 'firebase-admin';
// import functions from 'firebase-functions';
import nodemailer from 'nodemailer';
// import serviceAccountCredentials
// from '../data/firebase-private-key/serviceAccountKey.json';
import config from '../config.json';

function PushNotifier(receivingEmails: string) {
    // // Setting up Firebase
    // const serviceAccount = serviceAccountCredentials as
    //     firebaseAdmin.ServiceAccount;
    // const defaultAppConfig = {
    //     credential: firebaseAdmin.credential.cert(serviceAccount),
    //     // config.FIREBASE.serviceAccountKey),
    //     // databaseURL: 'https://node-xxxxx.com'
    // };

    // Initializing Firebase Admin SDK
    // firebaseAdmin.initializeApp(defaultAppConfig);


    // Setting up Nodemailer
    const transporter = nodemailer.createTransport({
        // host: 'smtp.mailtrap.io',
        host: 'smtp.gmail.com',
        port: 2525,
        auth: {
            // user: config.SMTP_CREDENTIALS.USERNAME,
            // pass: config.SMTP_CREDENTIALS.PASSWORD
            user: 'tetconchuot3101@gmail.com',
            pass: 'insideout'
        }
    });

    const mailOptions = {
        from: 'Nodemailer sender',
        to: receivingEmails,
        subject: 'Email sent via Firebase',
        text: 'Hello world!',
        html: '<b>Sending emails with Firebase is easy!</b>'
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log('Loi sen: ', err)
        } else {
            console.log('info sen: ', info)
        }
    });

    // return senderPromise;

    // const emailSender = functions.https.onRequest((req, res) => {
    //     const to = 'abc@gmail.com'; //req.query.dest
    //     const mailOptions = {
    //         from: 'sieusanh00@gmail.com',
    //         to: to,
    //         subject: 'Email sent via Firebase',
    //         html: '<b>Sending emails with Firebase is easy!</b>'
    //     }
    //     transporter.sendMail(mailOptions, (err, info) => {
    //         if (err) {
    //             return res.send(err.toString());
    //         }
    //         return res.send('Email sent successfully');
    //     });
    // });

    // return emailSender;
}

export default PushNotifier;

// PushNotifier.prototype.sendToIOS = function (data) {
//     const ios = {
//         headers: {
//             'apns-priority': '10',
//             'apns-expiration': '360000'
//         },
//         payload: {
//             aps: {
//                 alert: {
//                     title: 'title push'
//                 },
//                 badge: 1,
//                 sound: 'default',
//             }
//         }
//     };

//     const message = {
//         apns: ios,
//         token: token
//     };

//     firebaseAdmin.messaging().send(message)
//         .then((response) => {
//             // response is a message ID string
//         })
//         .catch((error) => {
//             console.log('Loi firebase send: ', error)
//         });
// }