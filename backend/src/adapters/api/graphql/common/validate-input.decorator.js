// src/adapters/api/graphql/common/validate-input.decorator.ts
import { BadRequestException, UsePipes, ValidationPipe } from '@nestjs/common';
import { formatValidationErrors } from './validation.formatter';
// eslint-disable-next-line @typescript-eslint/naming-convention
export const ValidateInput = () => UsePipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    disableErrorMessages: false,
    stopAtFirstError: false,
    validationError: {
        target: false,
        value: false,
    },
    exceptionFactory: (errors) => {
        const message = formatValidationErrors(errors);
        return new BadRequestException(message);
    },
}));
