import BaseError from "./BaseError";

export default class FieldsMissingError extends BaseError {
  missingFields: string[];

  constructor(missingFields: string[]) {
    super(400, `Field(s) '${missingFields.join(', ')}' required.`);

    this.missingFields = missingFields;
  }
}