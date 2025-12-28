import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseParamsPaginationPipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    const { itemPerPage, page } = value ?? {};
    if (itemPerPage) value.itemPerPage = parseInt(itemPerPage);
    if (page) {
      const pageParsed = parseInt(page);
      value.page = isNaN(pageParsed) || pageParsed === 0 ? 1 : pageParsed;
    }
    return value;
  }
}
