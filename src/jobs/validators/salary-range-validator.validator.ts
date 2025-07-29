import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { JobsListRequest } from '../dto';
import { SALARY_MAX_LESS_THAN_MIN, SALARY_MIN_GREATER_THAN_MAX } from '../constants';

@ValidatorConstraint({ name: 'SalaryMinNotGreaterThanSalaryMax', async: false })
export class SalaryMinNotGreaterThanSalaryMax implements ValidatorConstraintInterface {
    validate(salaryMin: number, args: ValidationArguments) {
        const obj = args.object as JobsListRequest;
        if (obj.salaryMax !== undefined && salaryMin !== undefined) {
            return salaryMin <= obj.salaryMax;
        }
        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return SALARY_MIN_GREATER_THAN_MAX;
    }
}

@ValidatorConstraint({ name: 'SalaryMaxNotLessThanSalaryMin', async: false })
export class SalaryMaxNotLessThanSalaryMin implements ValidatorConstraintInterface {
    validate(salaryMax: number, args: ValidationArguments) {
        const obj = args.object as JobsListRequest;
        if (obj.salaryMin !== undefined && salaryMax !== undefined) {
            return salaryMax >= obj.salaryMin;
        }
        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return SALARY_MAX_LESS_THAN_MIN;
    }
}