import { IsString, Matches, MinLength } from "class-validator";

export class ChangePasswordDto {
    @IsString()
    oldPassword: string;

    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).*$/, {
        message: 'Password must contain at least one capital or smaller letter, one number, and one special character',
    })
    newPassword: string;
}