import { AppError } from '../errors/app-error';

export function parsePositiveIntegerQuery(
  value: unknown,
  fieldName: string,
  defaultValue: number
): number {
  if (value === undefined) {
    return defaultValue;
  }

  if (typeof value !== 'string') {
    throw new AppError(`${fieldName} must be a number`, 400);
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new AppError(`${fieldName} must be a positive integer`, 400);
  }

  return parsedValue;
}

export function parseStringParam(value: unknown, fieldName: string): string {
  if (typeof value !== 'string') {
    throw new AppError(`${fieldName} must be a string`, 400);
  }

  return value;
}
