export interface Resp<T> {
  code: number;
  message: string;
  data: T;
}

export type PageResp<T> = Resp<{
  content: T[];
  total: number;
}>;
