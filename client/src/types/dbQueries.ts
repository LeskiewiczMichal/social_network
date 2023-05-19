export enum SortOrder {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
}

export interface Queries {
  sortOrder: SortOrder;
  offset: number;
  limit: number;
}
