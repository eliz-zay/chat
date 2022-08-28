import { User } from '../model';

export class UserSchema {
    id: number;
    
    username: string;
}

export function transformToUserSchema(user: User): UserSchema {
    const { id, username } = user;

    return { id, username };
}
