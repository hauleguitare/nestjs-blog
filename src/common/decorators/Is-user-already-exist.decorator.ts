import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { UserService } from 'src/users/user.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUserAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly userService: UserService) {}
  async validate(
    usernameOrEmail: any,
    validationArguments?: ValidationArguments | undefined,
  ): Promise<boolean> {
    const user = await this.userService.findUsernameOrEmail(usernameOrEmail);
    if (!user) {
      return true;
    }
    return false;
  }
  defaultMessage?(
    validationArguments?: ValidationArguments | undefined,
  ): string {
    return 'User already exists. Choose another name.';
  }
}
export function IsUserAlreadyExist(validationOption?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOption,
      constraints: [],
      validator: IsUserAlreadyExistConstraint,
    });
  };
}
