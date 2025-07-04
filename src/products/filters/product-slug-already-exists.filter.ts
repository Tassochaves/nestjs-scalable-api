import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { ProductSlugAlreadyExistsError } from "../errors";
import { Response } from "express";

@Catch(ProductSlugAlreadyExistsError)
export class ProductSlugAlreadyExistsErrorFilter implements ExceptionFilter{
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const errorResponse = {
            statusCode: 409,
            message: exception.message,
            timestamp: new Date(),
        };

        response.status(409).json(errorResponse);
    }

}