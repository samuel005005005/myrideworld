import { BadRequestException } from '@nestjs/common';
export class ZodValidationPipe {
    schema;
    constructor(schema) {
        this.schema = schema;
    }
    transform(value, metadata) {
        if (metadata.type !== 'body')
            return value;
        try {
            const parsedValue = this.schema.parse(value);
            return parsedValue;
        }
        catch (error) {
            throw new BadRequestException({
                message: 'Error de validación en los datos de entrada',
                errors: error.errors,
            });
        }
    }
}
//# sourceMappingURL=zod-validation.pipe.js.map