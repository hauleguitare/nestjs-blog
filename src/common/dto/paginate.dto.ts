import { IQueryOptions } from '../interfaces/query-options.interface';

export class Paginate<Entity> {
  public static TAKE: number = 10;
  results: Entity[];
  total_pages: number;
  page: number;
  total_results: number;
  has_next?: boolean;
  has_previous?: boolean;
  constructor(props: IPaginateProperty<Entity>) {
    const { queryOption, ...other } = props;
    Object.assign(this, other);

    this.page = queryOption.page || 1;
    this.total_pages = Paginate.calcTotalPages(this.total_results);

    this.has_next = queryOption.page < this.total_pages;
    this.has_previous = queryOption.page > 1;
  }
  public static calcTotalPages(total_results: number) {
    return Math.ceil(total_results / Paginate.TAKE);
  }

  public static calcSkip(currentPage: number) {
    return Paginate.TAKE * currentPage - Paginate.TAKE;
  }
}

export interface IPaginateProperty<Entity> {
  results: Entity[];
  total_pages?: number;
  page?: number;
  total_results: number;
  queryOption: IQueryOptions;
  has_next?: boolean;
  has_previous?: boolean;
}
