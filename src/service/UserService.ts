import { Repository } from 'typeorm';

import { JwtPayload, ApiError, getDataSource, generateHash, generateSalt, generateToken } from '../common';
import { User } from '../model';
import { SignUpRequest, LoggedInResponse, SignInRequest } from '../schema';

export class UserService {
    private userRepository: Repository<User>;

    constructor() {
        const dataSource = getDataSource();

        this.userRepository = dataSource.getRepository(User);
    }

    public async signUp(payload: SignUpRequest): Promise<LoggedInResponse> {
        const { username, password } = payload;

        const duplicateUser = await this.userRepository.findOne({ where: { username } });
        if (duplicateUser) {
            throw new ApiError('User already exists');
        }

        const salt = generateSalt();
        const passwordHash = await generateHash(password, salt);

        const partialUser = new User({ username, passwordHash, salt });

        const user = await this.userRepository.save(partialUser);

        const token = await this.generateUserToken(user);

        return { id: user.id, token };
    }

    public async signIn(payload: SignInRequest): Promise<LoggedInResponse> {
        const { username, password } = payload;

        const user = await this.userRepository.findOne({ where: { username }});

        if (!user) {
            throw new ApiError('User not found');
        }

        const passwordHash = await generateHash(password, user.salt);
        if (passwordHash !== user.passwordHash) {
            throw new ApiError('Incorrect password');
        }

        const token = await this.generateUserToken(user);

        return { id: user.id, token };
    }

    private async generateUserToken(user: User): Promise<string> {
        const payload: JwtPayload = { id: user.id, username: user.username };

        const token = await generateToken(payload);

        return token;
    }
}
