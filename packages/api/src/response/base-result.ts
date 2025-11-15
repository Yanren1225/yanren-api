import { BaseResultCode } from "@/response/code";

export const success = <T = unknown>(data: T): BaseResponse<T> => {
  return {
    code: BaseResultCode.SUCCESS.code,
    message: BaseResultCode.SUCCESS.desc,
    success: true,
    data,
  };
};

export const fail = <T = unknown>(
  data?: T,
  code?: BaseResultCode,
  message?: string
): BaseResponse<T> => {
  return {
    code: code?.code ?? BaseResultCode.FAIL.code,
    message: message || code?.desc || BaseResultCode.FAIL.desc,
    success: false,
    data: data || Object.create({}),
  };
};
