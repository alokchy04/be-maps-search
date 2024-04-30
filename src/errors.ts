export class FetchError extends Error {
  constructor(message: string, originalError?: Error) {
    super(message);
    this.name = "FetchError";

    if (originalError && originalError.stack) {
      this.stack += `\nCaused by: ${originalError.stack}`;
    }
  }
}

export class AppError extends Error {
  constructor(message: string, originalError?: Error) {
    super(message);
    this.name = "AppError";

    if (originalError && originalError.stack) {
      this.stack += `\nCaused by: ${originalError.stack}`;
    }
  }
}
