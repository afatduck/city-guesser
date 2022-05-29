import {ComponentProps} from "react"

export const Input = (props: Props) => {
    return <div className={"mb-2 " + (props.error && "error-input")}>
        <label htmlFor={props.id}>{props.placeholder}:</label>
        <input {...props} />
        {props.error && <p>{props.error}</p>}
    </div>
}

interface Props extends ComponentProps<'input'> {
    error?: string
    id: string
    placeholder: string
}