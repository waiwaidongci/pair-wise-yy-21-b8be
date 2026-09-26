// service 层抛出、controller 层分别包装的业务异常
export class ServiceError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "ServiceError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
