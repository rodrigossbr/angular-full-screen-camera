import {PermissionType} from "../enums/permission-type.enum";

export class PermissionError extends Error {

  constructor(
    public type: PermissionType,
    message: string
  ) {
    super(message);
  }
}
