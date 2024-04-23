import sign from "../src/sign";
import decode from "../src/decode"

describe("decode", () => {
    const secret = "defaultSecret";
    const name = "Pawel";

    it("should decode the paylod of the token", () => {
        const token = sign({
            payload: { name: name },
            secret: secret,
        });

        const decdoded = decode({ token });

        expect(decdoded.name).toBe(name);
    });
});