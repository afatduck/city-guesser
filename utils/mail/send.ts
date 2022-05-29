import transporter from "./transporter";

export default function sendMail({to, subject, html}: Props) {
    transporter.sendMail({
        from: "Earth Guesser <earth.guesser@gmail.com>",
        to: to,
        subject: subject,
        html: html,
    });
}

interface Props {
    to: string;
    subject: string;
    html: string;
}