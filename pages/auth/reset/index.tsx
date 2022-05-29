import { useSession } from "next-auth/react";
import Head from "next/head";
import { FormEvent, useState } from "react";
import ButtonLoader from "../../../components/reusable/button-loader";
import { Input } from "../../../components/reusable/input";

export default function Reset() {

    const session = useSession();
    const [input, setInput] = useState(session.data?.user?.username || "");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        fetch("/api/auth/send-reset", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: input
            })
        }).then(res => {
            if (res.status === 200) {
                setSuccess(true);
            } else {
                res.json().then(data => {
                    setError(data.error);
                })
            }
        }).catch(err => { setError(err.message); })
        .finally(() => { setLoading(false); });
    }

  return (
    <>
    <Head>
        <title>Forgot Password | EathGuesser</title>
    </Head>
    <div className="middle-box">
        <div>
            <h2 className="mb-4">Forgot password:</h2>
            {
                success ? <p>The request has been successfully sent. Check your email. </p> :
                <form onSubmit={handleSubmit}>
                <Input value={input} onChange={(e) => setInput(e.target.value)}
                placeholder="Username" error="" id="username_input" />
                <p className="text-red-600">{error}</p>
                <ButtonLoader loading={loading} message="Send reset request"/>
            </form>
            }
        </div>
    </div>
    </>
  );
}

