import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseParamsOptionPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const limit = value?.limit;
    if (limit) {
      value.limit = parseInt(limit);
    }
    return value;
  }
}
