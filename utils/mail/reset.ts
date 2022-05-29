export const resetMailHTML = ({name, url}: Props) => `
<p>Hi ${name}, someone (hopefully you) has requested a new password reset link.
Click the link down below to change your password.</p>
<p><a href="${url}">${url}</a></p>
<p>If you did not request this email, please ignore it.</p>
<p>If you have any questions, you can reply to this email.</p>
<p>Thank you, <span style="color:green">Earth</span>Guesser.</p>
`

interface Props {
    name: string;
    url: string;
}