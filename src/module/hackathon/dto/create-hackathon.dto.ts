import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isFutureDate', async: false })
class IsFutureDateConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return (
      !(value instanceof Date) ||
      Number.isNaN(value.getTime()) ||
      value.getTime() > Date.now()
    );
  }

  defaultMessage(): string {
    return 'must be a future date';
  }
}

export class CreateHackathonDto {
  @IsString()
  @MinLength(3)
  name!: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  description?: string;

  @Type(() => Date)
  @IsDate()
  @Validate(IsFutureDateConstraint)
  startsAt!: Date;

  @Type(() => Date)
  @IsDate()
  @Validate(IsFutureDateConstraint)
  endAt!: Date;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
