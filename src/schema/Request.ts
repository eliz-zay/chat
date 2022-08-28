import { Transform } from 'class-transformer';
import { IsInt, IsString, Min, MaxLength, MinLength } from 'class-validator';

export class SignUpRequest {
    @IsString()
    @MinLength(1)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(1)
    @MaxLength(64)
    password: string;
}

export class SignInRequest {
    @IsString()
    @MinLength(1)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(1)
    @MaxLength(64)
    password: string;
}

export class AddPrivateChatRequest {
    @IsInt()
    @Min(1)
    userId: number;
}

export class ChatHistoryRequest {
    @Transform(value => value ? Number(value) : null, { toClassOnly: true })
    @IsInt()
    @Min(1)
    chatId: number;
}
