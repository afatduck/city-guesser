import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { decode } from "next-auth/jwt";
import Head from "next/head";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import ButtonLoader from "../../../components/reusable/button-loader";
import { Input } from "../../../components/reusable/input";
import { validatePasswordError } from "../../../utils/validate";

export default function ({token, valid}: Props) {

    if (!valid) {
        return <><Head><title>Invalid Password Reset Link | EarthGuesser</title></Head>
        <div className="middle-box"><div><h2 className="mb-4">Invalid Link</h2>
                <p>The link you followed is invalid or has expired.
                You can request a new one <Link href="/auth/reset">
                    <a className="text-green-600">here</a></Link>.</p>
            </div></div>
        </>
    }

    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({
        password: "",
        confirmPassword: "",
    });
    const [success, setSuccess] = useState(false);

    const setInputAndError = (name: string, value: string, error: string) => {

        const checkConfirmPassword = 
          (name === "password" && input.confirmPassword) ? {
            "confirmPassword": value === input.confirmPassword ?
              "" : "Passwords do not match." } : {};

        setInput({ ...input, [name]: value });
        setErrors({ ...errors, [name]: (value && error), ...checkConfirmPassword });
    }

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
      setInputAndError("password", e.target.value, validatePasswordError(e.target.value));
    }

    const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
      const passwordError = (e.target.value !== input.password && "Passwords do not match.") || "";
      setInputAndError("confirmPassword", e.target.value, passwordError);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();        
        if (loading || Object.values(errors).filter(e => !!e).length) return;
        for (const key in input) {
            if (input[key as keyof typeof input] === "") {
                setErrors({ ...errors, [key]: "This field is required." });
                return;
            }
        }
        setLoading(true);
        fetch("/api/auth/reset", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token,
                password: input.password,
            }),
        }).then(res => {
            if (!res.ok) {
                setErrors({
                    ...errors,
                    password: "An error occurred. Please try again.",
                });
            } else {
                setSuccess(true);
            }
        }).catch(err => {}).finally(() => {
            setLoading(false);
        });

    }

    return (
        <>
        <Head>
            <title>Set New Password | EarthGuesser</title>
        </Head>
        <div className="middle-box">
           <div>
               <h2>New Password</h2>
                {
                    success ? <p className="mt-4">Your password has been successfully changed. You can now go sign in 
                        <Link href="/auth/cred-signin"><a className="text-green-600"> here</a></Link>.</p> :
                    <form className="mt-4 flex flex-col" onSubmit={handleSubmit}>

                    <Input type="password" name="password"
                    value={input.password} onChange={handlePasswordChange}
                    placeholder="Password" id="input_password" 
                    error={errors.password} />

                    <Input type="password" name="confirmPassword"
                    value={input.confirmPassword} onChange={handleConfirmPasswordChange}
                    placeholder="Confirm password" id="input_confirmPassword"
                    error={errors.confirmPassword} />

                    <ButtonLoader loading={loading} message="Change password" />
                    
                </form>
                }

           </div>
        </div>
        </>
    );

}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<{props: Props}> {
    const base64Token = context.params?.token;
    const props: Props = {
        token: String(base64Token),
        valid: false
    };

    if (typeof base64Token === "string" && base64Token.length > 0) {
        const token = Buffer.from(base64Token, "base64").toString("ascii");
        const decoded = await decode({
            secret: process.env.SECRET as string,
            token,
        }).catch(() => {});
        props.valid = typeof decoded?.userId === "string";
    }

    return { props };
}

interface Props {
    valid: boolean;
    token: string;
}