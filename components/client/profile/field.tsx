import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Check, Pencil, X } from "tabler-icons-react";
import { Input } from "../../reusable/input";

export default function ChangeableField({className,label,value,validate,submit}: Props) {

    const [open, setOpen] = useState(false);
    const [input, setInput] = useState(value);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        setError(validate(e.target.value));
    }, [validate])

    const handleSubmit = useCallback(async (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        if (error) return;
        setLoading(true);
        const err = await submit(input);
        setLoading(false);
        if (err) setError(err);
        else setOpen(false);
    }, [input, error, submit])

    const closeIfClickedOutside = useCallback((e: MouseEvent) => {
        const form = document.getElementById("temp-form");
        const path = e.composedPath();
        if (form && !path.includes(form)) setOpen(false);
    }, [])

    useLayoutEffect(() => {
        if (open) {
            document.addEventListener("mousedown", closeIfClickedOutside)
            return
        };
        setInput(value)
        setError("");
        document.removeEventListener("mousedown", closeIfClickedOutside);
        return () => {
            document.removeEventListener("mousedown", closeIfClickedOutside);
        }
    }, [open, value, closeIfClickedOutside])

    if (!open) {
        return <p className={className + " flex gap-2"}>
            {
                value ? value :
                <span>no {label.toLowerCase()}</span>
            }
            <Pencil onClick={e => {e.stopPropagation();setOpen(true)}} data-id="open"/>
        </p>
    }

    return <form onSubmit={handleSubmit} className="flex items-end 
        gap-4" id="temp-form">
        <Input type="text" value={input} onChange={handleChange}
        placeholder={label} error={error} id={`${label}-input`} />
        {
            loading ? <div className="h-4 !w-4 bg-green-600
            rounded-full animate-ping !m-3" /> :
            <>
            <Check onClick={()=>{handleSubmit()}} className={error && "mb-5"} />
            <X onClick={() => setOpen(false)} className={error && "mb-5"} />
            </>
        }
    </form>

}

interface Props {
    className?: string;
    label: string;
    value: string;
    validate: (value: string) => string;
    submit: (value: string) => Promise<string>;
}