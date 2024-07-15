import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";

export class DTOValidatorMiddleware {
  public static validateParamsDto(dtoClass: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const dtoInstance = plainToInstance(dtoClass, req.params);
      const errors = await validate(dtoInstance as Object);

      if (errors.length > 0) {
        return res.status(400).json(
          errors.map((error: ValidationError) => ({
            property: error.property,
            constraints: error.constraints,
          }))
        );
      }
      next();
    };
  }

  public static validateQueryDto(dtoClass: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const dtoInstance = plainToInstance(dtoClass, req.query);
      const errors = await validate(dtoInstance as Object);

      if (errors.length > 0) {
        return res.status(400).json(
          errors.map((error: ValidationError) => ({
            property: error.property,
            constraints: error.constraints,
          }))
        );
      }
      next();
    };
  }

  public static validateBodyDto(dtoClass: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const dtoInstance = plainToInstance(dtoClass, req.body);
      const errors = await validate(dtoInstance);

      if (errors.length > 0) {
        return res.status(400).json(
          errors.map((error: ValidationError) => ({
            property: error.property,
            constraints: error.constraints,
          }))
        );
      }
      next();
    };
  }
}
