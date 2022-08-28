export class ApiError extends Error {
    public details: Object;

    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, ApiError.prototype);
        
        this.name = 'ApiError';
        this.details = { message };
    }
}
