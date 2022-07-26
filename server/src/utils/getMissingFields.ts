import { Request } from "express"

export const getMissingFields = (req: Request, requiredFields: string[]) => {
  const givenFields = requiredFields.filter(field => !(req.body[field] === undefined));
  const missingFields = requiredFields.filter(field => !givenFields.includes(field));

  return missingFields;
}