export class CredentialsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CredentialsError";
    }
}
