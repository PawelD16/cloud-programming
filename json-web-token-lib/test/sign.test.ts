import sign from "../src/sign"

describe("sign", () => {
    const secret = "defaultSecret";

    it("should produce different signatures for unequal payloads", () => {

        const jwt1 = sign({
            payload: { name: "Pawel" },
            secret: `${secret} - 1`,
            options: { expiresIn: 8.64e7 },
        })
            .split(".")[2];

        const jwt2 = sign({
            payload: { name: "Pawel" },
            secret: `${secret} - 2`,
            options: { expiresIn: 8.64e7 },
        })
            .split('.')[2];

        expect(jwt1).not.toBe(jwt2);
    });

    it("should add expiry to the payload", () => {

        const jwt1 = sign({
            payload: { name: "Pawel" },
            secret: `${secret} - 1`,
            options: { expiresIn: 8.64e7 },
        })
            .split('.')[1];

        expect(typeof JSON.parse(atob(jwt1)).exp).toBe("number")
    });
});