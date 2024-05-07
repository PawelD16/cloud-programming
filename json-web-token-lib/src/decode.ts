
const INVALID_JWT = "Invalid JWT";

export interface DecodeInput {
    token: string
};

const decode = ({ token }: DecodeInput) => {
    const parts = token.split('.');

    if (parts.length !== 3)
        throw new Error(INVALID_JWT);

    const payload = parts[1];

    return JSON.parse(atob(payload));
};

export default decode;