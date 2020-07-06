export interface PaginationOptions {
  limit: number;
  page: number;
  sortDir: string;
  sortBy: string;
  search?: string | null;
}

export interface GetPaginationOptionsPayload {
  options: {
    limit: number;
    page: number;
    sort: string;
  };
  searchOptions: Record<string, unknown>;
}
