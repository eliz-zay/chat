import { Repository } from 'typeorm';
import { ApiError } from '../common/ApiError';

import { getDataSource } from '../common/db';
import { Chat, User } from '../model';
import {
    JwtPayload,
    ChatSchema,
    MessageSchema,
    transformToChatSchema,
    transformToMessageSchema,
    AddPrivateChatRequest,
    ChatHistoryRequest,
    UserSchema,
    transformToUserSchema,
} from '../schema';

export class ChatService {
    private chatRepository: Repository<Chat>;
    private userRepository: Repository<User>;

    constructor() {
        const dataSource = getDataSource();

        this.chatRepository = dataSource.getRepository(Chat);
        this.userRepository = dataSource.getRepository(User);
    }

    public async addPrivateChat(jwtPayload: JwtPayload, payload: AddPrivateChatRequest): Promise<ChatSchema> {
        const sender = await this.userRepository.findOne({ where: { id: jwtPayload.id }});
        const receiver = await this.userRepository.findOne({ where: { id: payload.userId }});

        if (!receiver) {
            throw new ApiError('Receiver not found');
        }

        const existingChat = await this.chatRepository
            .createQueryBuilder('chat')
            .innerJoin('chat.users', 'user')
            .where('chat.isPrivate = true')
            .groupBy('chat.id')
            .having(`array_agg(user.id) <@ array[${[sender.id, receiver.id]}]
                and array_agg(user.id) @> array[${[sender.id, receiver.id]}]`)
            .getOne();

        if (existingChat) {
            throw new ApiError('Chat already exists');
        }

        const chat = await this.chatRepository.save({ isPrivate: true, users: [sender, receiver] });

        return transformToChatSchema(chat);
    }

    public async getChatHistory(jwtPayload: JwtPayload, payload: ChatHistoryRequest): Promise<MessageSchema[]> {
        const user = await this.userRepository.findOne({ where: { id: jwtPayload.id } });
        const chat = await this.chatRepository.findOne({
            where: { id: payload.chatId },
            relations: ['users', 'messages']
        });

        if (!chat) {
            throw new ApiError('Chat not found');
        }

        if (!chat.users.find(u => u.id === user.id)) {
            throw new ApiError('You don\'t have access to this chat');
        }

        return chat.messages.map(m => transformToMessageSchema(m));
    }

    public async getChatUsers(chatId: number): Promise<UserSchema[]> {
        const chat = await this.chatRepository.findOne({ where: { id: chatId }, relations: ['users'] });

        if (!chat) {
            throw new ApiError('Chat not found');
        }

        return chat.users.map(u => transformToUserSchema(u));
    }
}
