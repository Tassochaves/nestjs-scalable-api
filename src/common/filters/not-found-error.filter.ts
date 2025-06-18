import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { NotFoundError } from "../errors";
import { Response } from "express";

@Catch(NotFoundError)
export class NotFoundErrorFilter implements ExceptionFilter {
    catch(exception: NotFoundError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const errorResponse = {
            statusCode: 404,
            message: exception.message,
            timestamp: new Date(),
        };

        response.status(404).json(errorResponse);
    }

}