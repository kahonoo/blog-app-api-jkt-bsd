import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError";

export const errorMiddleware = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || "something went wrong";
  res.status(status).send({ message });
};
