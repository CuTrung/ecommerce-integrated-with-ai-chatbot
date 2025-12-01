import { Global, Injectable } from '@nestjs/common';

@Global()
@Injectable()
export class QueryUtilService {
  convertFieldsSelectOption<T>(value?: string) {
    const data = value
      ?.split(',')
      ?.reduce(
        (acc, field) => ({ ...acc, [field.trim()]: true }),
        {} as Partial<Record<keyof T, true>>,
      );
    return data;
  }
}
