import BaseError from "./BaseError";

export default class AuthorizationError extends BaseError {
  constructor(message: string) {
    super(401, message);
  }
}