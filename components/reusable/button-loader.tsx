import { Loader } from "./loader";

export default function ButtonLoader({loading, message}: Props) {
    return loading ? <Loader className="!text-green-600 
        mt-4 self-center w-6 h-6" /> : 
        <button className="bg-green-600 w-full rounded-md
        py-2 mt-6">
            {message}
        </button>
}

interface Props {
    loading: boolean;
    message: string;
}