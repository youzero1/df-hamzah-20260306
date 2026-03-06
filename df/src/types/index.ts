export interface CalculationRecord {
  id: number;
  expression: string;
  result: string;
  type: string;
  createdAt: string;
}

export type CalculationType = 'basic' | 'tax' | 'discount' | 'margin' | 'markup';

export interface CalculationPayload {
  expression: string;
  result: string;
  type: CalculationType;
}
