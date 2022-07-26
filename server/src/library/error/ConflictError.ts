import BaseError from "./BaseError";

export default class ConflictError extends BaseError {
  constructor(message: string) {
    super(409, message);
  }
}