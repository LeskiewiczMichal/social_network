class MissingBodyError extends Error {
  public status: number;

  constructor(field: string) {
    super(`Missing required body field: ${field}`);
    this.name = 'MissingBodyError';
    this.status = 400;
  }
}

class UnauthorizedError extends Error {
  public status: number;

  constructor() {
    super('Unauthorized');
    this.name = 'UnauthorizedError';
    this.status = 401;
  }
}

class BadRequestError extends Error {
  public status: number;

  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
    this.status = 400;
  }
}

export { MissingBodyError, UnauthorizedError, BadRequestError };
