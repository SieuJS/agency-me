import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class UpdateItemPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        // Add your transformation logic here
        console.log('UpdateItemPipe called with value:', value);
        return {
            ...value,
            // Example transformation: ensure don_gia is a number
            don_gia: parseFloat(value.don_gia) || 0, // Default to 0 if parsing fails
        }
    }
}