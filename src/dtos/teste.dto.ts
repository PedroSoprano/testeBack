import { IsString, IsNotEmpty, ValidateNested, ValidatorConstraint,  ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator, IsDefined,  } from "class-validator";


export class CreateUserDTO {
    @IsNotEmpty()
    @IsString()
    login!: string;

    @IsNotEmpty()
    @IsString()
    @IsDefined()
    password!: string;

    @IsNotEmpty()
    @IsString()
    name!: string;
  
}
