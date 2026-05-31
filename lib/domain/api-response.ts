export type ApiSuccess<T> = {
  ok: true;
  data: T;
  error: null;
};

export type ApiFailure = {
  ok: false;
  data: null;
  error: {
    code: string;
    message: string;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export function success<T>(data: T): ApiSuccess<T> {
  return {
    ok: true,
    data,
    error: null,
  };
}

export function failure(code: string, message: string): ApiFailure {
  return {
    ok: false,
    data: null,
    error: {
      code,
      message,
    },
  };
}
