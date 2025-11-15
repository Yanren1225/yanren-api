export class BaseResultCode {
  code: number;
  desc: string;
  constructor(code: number, desc: string) {
    this.code = code;
    this.desc = desc;
  }

  static SUCCESS = new BaseResultCode(200, "success");

  static NOT_FOUND = new BaseResultCode(404, "not found");

  static FAIL = new BaseResultCode(5000, "system fail");
  static INVALID_PARAMS = new BaseResultCode(5001, "invalid params");
}
