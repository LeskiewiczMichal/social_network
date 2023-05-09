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

class NotFoundError extends Error {
  public status: number;

  constructor() {
    super('Not found');
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

export { MissingBodyError, UnauthorizedError, BadRequestError, NotFoundError };
