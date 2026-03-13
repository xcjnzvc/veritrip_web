// 백엔드 공통 응답/메타 DTO를 프론트에서 재사용하기 위한 타입 정의
// Nest의 MetaDto / ApiResponse / ApiResponseWithData 와 1:1로 맞춘 구조입니다.

export interface Meta {
  /** 전체 수 (totalCount) */
  totalCount: number;
  /** 현재 페이지 */
  page: number;
  /** 한 페이지의 제한 수 */
  limit: number;
  /** 총 페이지 수 */
  totalPages: number;
}

/** API 응답 공통 타입 (data nullable) */
export type ApiResponse<T = null> = {
  code: number;
  message: string;
  data: T | null;
  meta?: Meta;
};

/** API 응답 타입 (data 필수, data 제공 시 사용) */
export type ApiResponseWithData<T> = {
  code: number;
  message: string;
  data: T;
  meta?: Meta;
};

/** 리스트 응답 (data가 배열인 경우에 사용) */
export type ListResponse<T> = ApiResponseWithData<T[]>;
