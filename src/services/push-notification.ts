
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';
import config from '../config.json';


async function PushNotifier(receivingEmails: string) {
    const GOOGLE_MAILER_CLIENT_ID = '164901748839-oqm5fqf542crlprim7crctr0a287emiq';//'.apps.googleusercontent.com';
    // const GOOGLE_MAILER_CLIENT_ID = '164901748839-oqm5fqf542crlprim7crctr0a287emiq';
    const GOOGLE_MAILER_CLIENT_SECRET = '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';
    const GOOGLE_MAILER_REFRESH_TOKEN = '1//04v_0xgdH-9JkCgYIARAAGAQSNwF-L9Ir1Z5hOpMO84ioNigFtZOGrYQvs4vTH5jj3VT0iAe0g_yQM60k9MbbcxiWpWv7Je-wi4k';
    const ADMIN_EMAIL_ADDRESS = 'tetconchuot3101@gmail.com';

    const myOAuth2Client = new OAuth2Client(
        GOOGLE_MAILER_CLIENT_ID,
        GOOGLE_MAILER_CLIENT_SECRET
    );

    myOAuth2Client.setCredentials({
        refresh_token: GOOGLE_MAILER_REFRESH_TOKEN
    });

    const myAccessTokenObject = await myOAuth2Client.getAccessToken();
    const myAccessToken = myAccessTokenObject?.token;

    // Setting up Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: ADMIN_EMAIL_ADDRESS,
            clientId: GOOGLE_MAILER_CLIENT_ID,
            clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
            refreshToken: GOOGLE_MAILER_REFRESH_TOKEN,
            accessToken: myAccessToken
        }
    });

    const mailOptions = {
        // from: 'gmail sender',
        to: receivingEmails,
        subject: 'Email sent via Firebase',
        text: 'Hello world!',
        html: '<b>Sending emails with Firebase is easy!</b>'
    };

    const senderPromise = transporter.sendMail(mailOptions);

    return senderPromise;
}

export default PushNotifier;
