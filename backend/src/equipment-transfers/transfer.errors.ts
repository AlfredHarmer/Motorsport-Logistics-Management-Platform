export type TransferErrorCode = 
| "EQUIPMENT_NOT_FOUND"
| "ORIGIN_MISMATCH";

export class TransferError extends Error {
  constructor(
    public readonly code: TransferErrorCode,
    message: string,
  ) {
    super(message);
    this.name ="TransferError";
  }
};