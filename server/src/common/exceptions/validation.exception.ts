import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  ConflictException,
} from '@nestjs/common';

@Catch(HttpException, ConflictException)
export class ValidationException implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();

    let formattedErrors = {};

    if (status === 400) {
      // handle DTO exceptions
      if (Array.isArray(exceptionResponse.message)) {
        formattedErrors = this.formatValidationErrors(
          exceptionResponse.message,
        );
      } else {
        // handle exceptions
        formattedErrors = this.formatServiceErrors(exceptionResponse.message);
      }
    } else if (status === 409) {
      // handle ConflictException
      formattedErrors = this.formatConflictErrors(exceptionResponse.message);
    } else {
      // other exceptions
      formattedErrors = { error: exceptionResponse.message };
    }

    response.status(status).json({
      errors: formattedErrors,
      error: exceptionResponse.error || 'Bad Request',
      statusCode: status,
    });
  }

  private formatValidationErrors(errors: string[]): Record<string, string> {
    const errorMap: Record<string, string> = {};

    errors.forEach((error: string) => {
      const [field, message] = error.split(':').map((part) => part.trim());
      if (field && message) {
        errorMap[field] = message;
      }
    });

    return errorMap;
  }

  private formatServiceErrors(message: string): Record<string, string> {
    const errorMap: Record<string, string> = {};

    // Error format: 'field: error message'
    const parts = message.split(':');
    if (parts.length === 2) {
      const field = parts[0].trim();
      const errorMsg = parts[1].trim();
      errorMap[field] = errorMsg;
    }

    return errorMap;
  }

  private formatConflictErrors(message: string): Record<string, string> {
    const errorMap: Record<string, string> = {};

    // Handle specific format for ConflictException
    const parts = message.split(':');
    if (parts.length === 2) {
      const field = parts[0].trim();
      const errorMsg = parts[1].trim();
      errorMap[field] = errorMsg;
    } else {
      errorMap['conflict'] = message;
    }

    return errorMap;
  }
}
