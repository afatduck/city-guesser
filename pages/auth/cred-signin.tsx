import { signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { ArrowBackUp } from "tabler-icons-react";
import ButtonLoader from "../../components/reusable/button-loader";
import { Input } from "../../components/reusable/input";

export default function CredSignin() {

    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        username: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value,
        });
        if (errors[e.target.name as keyof typeof errors]) {
            setErrors({
                ...errors,
                [e.target.name]: "",
            });
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;
        if (!input.username) {
            setErrors({
                ...errors,
                username: "Username is required",
            });
            return;
        }
        if (!input.password) {
            setErrors({
                ...errors,
                password: "Password is required",
            });
            return;
        }
        setLoading(true);
        signIn("credentials", {
            ...input,
            redirect: false,
        }).then((res: any) => {
            const error = res.error;
            if (!error) router.push("/");
            else {
                let errorObject = {};
                if (error === "NF") errorObject = { username: "User not found" };
                if (error === "IP") errorObject = { password: "Incorrect password" };
                setErrors({
                    ...errors,
                    ...errorObject,
                });
            }
         })
         .finally(() => { setLoading(false); });
    }

    return (
        <>
        <Head>
            <title>Sign In | EarthGuesser</title>
        </Head>
        <div className="middle-box">
           <div>
                <div className="flex justify-between mb-4 items-center">
                    <h2>Sign in:</h2>
                    <Link href="/auth/signin">
                        <a className="text-sm">
                            Back
                            <ArrowBackUp className="inline-block" strokeWidth={1} />
                        </a>
                    </Link>
                </div>
                <p className="text-sm text-center text-neutral-400">
                    Don&apos;t have an account?
                    <Link href="/auth/cred-signup">
                        <a className="text-green-600 underline"> Sign up</a>
                    </Link>
                </p>

                <form className="mt-4 flex flex-col" onSubmit={handleSubmit}>
                    <Input type="text" name="username"
                    value={input.username} onChange={handleChange} 
                    placeholder="Username" id="input_username"
                    error={errors.username} />

                    <Input type="password" name="password"
                    value={input.password} onChange={handleChange}
                    placeholder="Password" id="input_password" 
                    error={errors.password} />

                    <Link href="/auth/reset">
                        <a className="self-end text-sm">
                            Forgor password?
                        </a>
                    </Link>

                    <ButtonLoader loading={loading} message="Sign in" />
                    
                </form>

           </div>
        </div>
        </>
    );
}