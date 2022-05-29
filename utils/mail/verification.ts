export const verificationMailHTML = ({name, url, firstTime}: Props) => {

    const firstParagraph = firstTime ? `Welcome to Earth Guesser, ${name},
    and thank you for joining! Before continuing, please verify
    your email address by clicking the link below.` : 
    `Hi ${name}, you have requested a new email verification link. 
    Please click the link below.`;

    return `
    <p>${firstParagraph}</p>
    <p><a href="${url}">${url}</a></p>
    <p>If you did not request this email, please ignore it.</p>
    <p>If you have any questions, you can reply to this email.</p>
    <p>Thank you, <span style="color:green">Earth</span>Guesser.</p>
    `

}

interface Props {
    name: string;
    url: string;
    firstTime: boolean;
}