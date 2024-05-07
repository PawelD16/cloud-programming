import verify from "../src/verify"
import sign from "../src/sign";
import { ONE_DAY_IN_MILLIS } from "../src/sign";

describe("verify", () => {
    const secret1 = "secret1";
    const secret2 = "secret2";

    const name = "Pawel";

    it("should verify and decode a valid token", () => {
        const token = sign({
            payload: { name: name },
            secret: secret1,
        });

        const verified = verify({
            token: token,
            secret: secret1
        });
        
        expect(verified.name).toBe(name);
    });

    it("should throw if signature is invalid", () => {
        const token = sign({
            payload: { name: name },
            secret: secret1,
        });

        try {
            verify({
                token: token,
                secret: secret2
            });
        } catch (e) {
            expect(e.message).toBe("Invalid signature");
        }
    });

    it("should throw if token is expired", () => {
        const token = sign({
            payload: { name: name },
            secret: secret1,
            options: {
                expiresIn: -ONE_DAY_IN_MILLIS
            }
        });

        try {
            verify({
                token: token,
                secret: secret1
            });
        } catch (e) {
            expect(e.message).toBe("Token is expired");
        }
    })
});