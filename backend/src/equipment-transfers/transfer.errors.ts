export type TransferErrorCode = 
| "EQUIPMENT_NOT_FOUND"
| "ORIGIN_MISMATCH"
| "TRANSFER_NOT_FOUND"
| "TRANSFER_NOT_DELETABLE";

export class TransferError extends Error {
  constructor(
    public readonly code: TransferErrorCode,
    message: string,
  ) {
    super(message);
    this.name ="TransferError";
  }
};