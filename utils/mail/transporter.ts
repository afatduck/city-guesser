import { Transporter, createTransport } from 'nodemailer';

let transporter: Transporter;

const create = () => {
    const t = createTransport({
        port: 465,
        host: 'smtp.gmail.com',
        secure: true,
        auth: {
            user: "earth.guesser@gmail.com",
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    return t;
}

if (process.env.NODE_ENV === 'production') {
    transporter = create();
}
else {
    if (!global.transporter) {
        global.transporter = create();
    }
    transporter = global.transporter;
}

export default transporter;

declare global {
    var transporter: Transporter;
}