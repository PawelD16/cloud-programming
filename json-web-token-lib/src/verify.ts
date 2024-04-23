import decode from "./decode";
import { createSignature } from "./sign";

const INVALID_TOKEN = "Invalid token";
const INVALID_SIGNATURE = "Invalid signature";
const EXPIRED_TOKEN = "Token is expired";

export interface VerifyInput {
    token: string,
    secret: string
};

const isDateInPast = ({ exp }: { exp: number }) => {
    return new Date(exp).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0);
};

const verify = ({ token, secret }: VerifyInput) => {
    const parts = token.split('.');

    if (parts.length !== 3)
        throw new Error(INVALID_TOKEN);

    const [encodedHeader, encodedPayload, signature] = parts;

    const candidateSignature = createSignature({ encodedHeader, encodedPayload, secret });

    if (signature !== candidateSignature)
        throw new Error(INVALID_SIGNATURE);

    const decoded = decode({ token });

    const { exp } = decoded;

    if (isDateInPast({ exp }))
        throw new Error(EXPIRED_TOKEN);

    return decoded;
};

export default verify;