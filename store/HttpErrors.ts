export class HttpErrors extends Error {
  public statusCode: number;
  public statusText: string;

  constructor(message: string, statusCode: number, statusText: string) {
    super(message);
    this.statusCode = statusCode;
    this.statusText = statusText;
    this.name = "MyHttpError";
  }
}

export class HttpValidationError extends HttpErrors {
  constructor(
    message: string,
    statusCode = 422,
    statusText = "Unprocessable Entity"
  ) {
    super(message, statusCode, statusText);
    this.name = "MyValidationError";
  }
}

export class HttpNotFoundError extends HttpErrors {
  constructor(message: string, statusCode = 404, statusText = "Not Found") {
    super(message, statusCode, statusText);
    this.name = "MyNotFoundError";
  }
}

export class HttpInternalServerError extends HttpErrors {
  constructor(
    message: string,
    statusCode = 500,
    statusText = "Internal Server Error"
  ) {
    super(message, statusCode, statusText);
    this.name = "MyInternalServerError";
  }
}
