import BaseError from "./BaseError";

export default class NotFoundError extends BaseError {
  propertyName: string;

  constructor(propertyName: string) {
    super(404, `Property '${propertyName}' not found.`);

    this.propertyName = propertyName;
  }
}