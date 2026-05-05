export interface ApiResult<T> {
  data: T;
  success: boolean;
  timestamp: string;
}
