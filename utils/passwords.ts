import { SHA256 } from "crypto-js";

const salt = process.env["SECRET"];

export const hashPassword = (password: string): string => {
    return SHA256(password + salt).toString();
}

export const checkPassword = (password: string, hash: string): boolean => {
    return hash === hashPassword(password);
}
