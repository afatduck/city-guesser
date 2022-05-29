import { signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { ArrowBackUp } from "tabler-icons-react";
import ButtonLoader from "../../components/reusable/button-loader";
import { Input } from "../../components/reusable/input";
import { validateEmail, validatePasswordError, validateUsernameError } from "../../utils/validate";

export default function CredSignup() {

    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const setInputAndError = (name: string, value: string, error: string) => {

        const checkConfirmPassword = 
          (name === "password" && input.confirmPassword) ? {
            "confirmPassword": value === input.confirmPassword ?
              "" : "Passwords do not match." } : {};

        setInput({ ...input, [name]: value });
        setErrors({ ...errors, [name]: (value && error), ...checkConfirmPassword });
    }

    const hadnleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
      setInputAndError("username", e.target.value, validateUsernameError(e.target.value));
    }

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
      const emailError = (!validateEmail(e.target.value) && "Email invalid.") || "";
      setInputAndError("email", e.target.value, emailError);
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
        fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        })
        .then(res => {
          if (!res.ok) {
            setLoading(false);
            res.json().then(data => {
              switch (data.error) {
                case "TU":
                  setErrors({ ...errors, username: "Username taken." });
                  break;
                case "TE":
                  setErrors({ ...errors, email: "Email taken." });
                  break;
              }
            });
            return;
          };
          signIn("credentials", {
            username: input.username,
            password: input.password,
            redirect: false,
          }).then(() => {router.push("/");});
        })
    }

    return (
        <>
        <Head>
            <title>Sign Up | EarthGuesser</title>
        </Head>
        <div className="middle-box">
           <div>
                <div className="flex justify-between mb-4 items-center">
                    <h2>Sign up:</h2>
                    <Link href="/auth/signin">
                        <a className="text-sm">
                            Back
                            <ArrowBackUp className="inline-block" strokeWidth={1} />
                        </a>
                    </Link>
                </div>
                <p className="text-sm text-center text-neutral-400">
                    Already have an account?
                    <Link href="/auth/cred-signin">
                        <a className="text-green-600 underline"> Sign in</a>
                    </Link>
                </p>

                <form className="mt-4 flex flex-col" onSubmit={handleSubmit}>
                    <Input type="text" name="username"
                    value={input.username} onChange={hadnleUsernameChange} 
                    placeholder="Username" id="input_username"
                    error={errors.username} />

                    <Input type="email" name="email"
                    value={input.email} onChange={handleEmailChange}
                    placeholder="Email" id="input_email"
                    error={errors.email} />

                    <Input type="password" name="password"
                    value={input.password} onChange={handlePasswordChange}
                    placeholder="Password" id="input_password" 
                    error={errors.password} />

                    <Input type="password" name="confirmPassword"
                    value={input.confirmPassword} onChange={handleConfirmPasswordChange}
                    placeholder="Confirm password" id="input_confirmPassword"
                    error={errors.confirmPassword} />

                    <ButtonLoader loading={loading} message="Sign up" />
                    
                </form>

           </div>
        </div>
        </>
    );
}