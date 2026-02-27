export interface BaseResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface PaginatedData<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  count: number;
}
