import crypto from "crypto";

const DEFAULT_OPTIONS = {
    expiresIn: 8.64e7 // this is 1 day
};

const DEFAULT_HASH_ALGORITHM = "SHA256";
const DEFAULT_ENCODING = "base64";
const DEFAULT_TYPE = "JWT";

export interface Options {
    expiresIn?: number
};

export interface SignInput {
    payload: object,
    secret: string,
    options?: Options
};

export interface CreateSignatureInput {
    secret: string,
    encodedHeader: string,
    encodedPayload: string
};

export const createSignature = ({
    secret,
    encodedHeader,
    encodedPayload
}: CreateSignatureInput) => {
    return crypto
        .createHmac(DEFAULT_HASH_ALGORITHM, secret)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest(DEFAULT_ENCODING);
};

const sign = ({
    payload,
    secret,
    options = {}
}: SignInput) => {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

    const header = {
        algorithm: DEFAULT_HASH_ALGORITHM,
        type: DEFAULT_TYPE
    };

    const encodedHeader = Buffer
        .from(JSON.stringify(header))
        .toString(DEFAULT_ENCODING);

    const expiresIn = Date.now() + mergedOptions.expiresIn;

    const encodedPayload = Buffer
        .from(
            JSON.stringify({
                ...payload,
                exp: expiresIn
            }))
        .toString(DEFAULT_ENCODING);

    const signature = createSignature({
        encodedPayload,
        encodedHeader,
        secret
    });

    return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export default sign;