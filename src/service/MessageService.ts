import { Repository } from 'typeorm';
import { ApiError } from '../common/ApiError';

import { getDataSource } from '../common/db';
import { Message, Chat } from '../model';
import { JwtPayload, AddMessageWsSchema, MessageSchema, transformToMessageSchema } from '../schema';

export class MessageService {
    private messageRepository: Repository<Message>;
    private chatRepository: Repository<Chat>;

    constructor() {
        const dataSource = getDataSource();

        this.messageRepository = dataSource.getRepository(Message);
        this.chatRepository = dataSource.getRepository(Chat);
    }

    public async addMessage(jwtPayload: JwtPayload, payload: AddMessageWsSchema): Promise<MessageSchema> {
        const chat = await this.chatRepository.findOne({ where: { id: payload.chatId }, relations: ['users'] });

        if (!chat) {
            throw new ApiError('Chat not found');
        }

        if (!chat.users.find(u => u.id === jwtPayload.id)) {
            throw new ApiError('You don\'t have access to this chat');
        }

        const message = await this.messageRepository.save({
            chatId: payload.chatId,
            senderId: jwtPayload.id,
            text: payload.text
        });

        return transformToMessageSchema(message);
    }
}
