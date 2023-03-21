import { ApiProperty } from '@nestjs/swagger';

/**
 * Pagination DTO
 * @property {number} page - page number
 * @property {number} limit - limit number
 * @property {string[][]} sortBy - sort by column and order
 * @property {string[]} searchBy - search by column
 * @property {string} search - search
 * @property {object} filter - filter
 * Reference: https://www.npmjs.com/package/nestjs-paginate
 */
export class PaginationDto {
  @ApiProperty({ default: 1, required: false })
  page: number;
  @ApiProperty({ default: 10, required: false })
  limit: number;
  @ApiProperty({ required: false })
  sortBy: [string, string][]; // [['column', 'ASC'], ['column', 'DESC']]
  @ApiProperty({ required: false })
  searchBy: string[]; // ['column', 'column']
  @ApiProperty({ required: false })
  search: string; // 'search'
  @ApiProperty({
    required: false,
    example: { 'filter.<column>': '$<operator>:<value>' },
    description:
      'Filter by column. Operator: $eq, $ne, $gt, $gte, $lt, $lte, $in, $nin',
  })
  filter: {
    [column: string]: string | string[];
  }; // { column: 'value' }
}
