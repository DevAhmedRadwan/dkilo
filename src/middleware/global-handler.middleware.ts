import { NextFunction, Request, Response } from "express";

export class GlobalHandlerMiddleware {
  public static notFoundHandler(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    res.status(404).json({
      message: "Not Found",
      status: 404,
    });
  }
  public static ErrorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
      status: err.status || 500,
    });
  }
}
