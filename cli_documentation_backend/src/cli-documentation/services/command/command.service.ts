import { Model, Types } from 'mongoose';
import { Injectable, Inject, HttpException, HttpStatus, forwardRef } from '@nestjs/common';
import { commandsDataInterface } from 'src/cli-documentation/interfaces/command.interface';
import { CreateCommandDto } from 'src/cli-documentation/dtos/create-command.dto';
import { GroupService } from './group.service';
import { EventsGateway } from 'src/common/gateway/gateway';
import { commandSocket } from 'src/cli-documentation/sockets/sockets.socket';

@Injectable()
export class CommandService {
    constructor(
        @Inject('COMMAND_MODEL') private readonly commandModel: Model<commandsDataInterface>,
        @Inject(forwardRef(() => GroupService)) private readonly _GroupService: GroupService,
        private readonly _appGateway: EventsGateway
    ) {}

    /**
     * Retrieves all commands.
     * @returns {Promise<commandsDataInterface[]>} List of all commands.
     */
    async findAll(): Promise<commandsDataInterface[]> {
        try {
            return await this.commandModel.find().exec();
        } catch (error) {
            throw new HttpException('Error fetching commands', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Creates a new command and associates it with a group.
     * @param {CreateCommandDto} CreateCommandDto - DTO for creating a command.
     * @returns {Promise<commandsDataInterface>} The created command with the updated group.
    */
    async create(CreateCommandDto: CreateCommandDto): Promise<commandsDataInterface> {
        const createdCommand = new this.commandModel(CreateCommandDto);

        try {
            const savedCommand = await createdCommand.save();

            try {
                const updatedGroup = await this._GroupService.addCommand({
                    groupId: CreateCommandDto.groupId,
                    command: savedCommand._id,
                });
                this._appGateway.emitEvent(commandSocket.create, {
                    ok: true,
                    data: { group: updatedGroup, command: savedCommand },
                    msg: "Socket Success!",
                });

                return savedCommand;
            } catch (groupError) {
                await this.commandModel.findByIdAndDelete(savedCommand._id);
                throw groupError;
            }
        } catch (error) {
            throw new HttpException('Error creating command', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Deletes multiple commands by their IDs and removes their references from groups.
     * @param {Types.ObjectId[]} commandIds - Array of command IDs to delete.
     * @returns {Promise<{ deletedCommands: Types.ObjectId[], updatedGroups: Types.ObjectId[] }>} The IDs of deleted commands and updated groups.
    */
    async deleteCommands(commandIds: Types.ObjectId[]): Promise<{ deletedCommands: Types.ObjectId[]; updatedGroups: Types.ObjectId[] }> {
        const session = await this.commandModel.db.startSession();
        session.startTransaction();

        try {
            const commands = await this.commandModel.find({ _id: { $in: commandIds } }).session(session);
            if (!commands.length) {
                throw new HttpException('No commands found for the provided IDs', HttpStatus.NOT_FOUND);
            }

            const groupIds = commands.map((command) => command.groupId);

            await this.commandModel.deleteMany({ _id: { $in: commandIds } }).session(session);

            const updatedGroups = await this._GroupService.removeCommandsFromGroups(groupIds, commandIds, session);

            await session.commitTransaction();
            session.endSession();

            this._appGateway.emitEvent(commandSocket.delete, {
                ok: true,
                removedSuccess: true,
                msg: "Socket Success!",
            });

            return {
                deletedCommands: commandIds,
                updatedGroups,
            };
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw new HttpException(`Error deleting commands: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Retrieves all commands that belong to a group by its groupId.
     * @param {Types.ObjectId} _id - The ID of the group.
     * @returns {Promise<commandsDataInterface[]>} List of commands belonging to the specified group.
    */
    async getCommandsByGroupId(_id: Types.ObjectId): Promise<commandsDataInterface[]> {
        try {
            // Buscar en la colección de comandos aquellos que tengan el campo 'groupId' igual a '_id'
            const commands = await this.commandModel.find({ groupId: _id }).exec();
            
            // Si no se encuentran comandos, lanzar una excepción
            if (!commands || commands.length === 0) {
                throw new HttpException('No commands found for the given groupId', HttpStatus.NOT_FOUND);
            }

            return commands;
        } catch (error) {
            // Si la excepción ya es de tipo HttpException, simplemente vuelve a lanzarla
            if (error instanceof HttpException) {
                throw error;
            }
            // Para cualquier otro error, lanza una excepción genérica
            throw new HttpException('Error fetching commands', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Deletes a command by its ID.
     * @param {Types.ObjectId} _id - The ID of the command to delete.
     * @returns {Promise<void>} A promise indicating the success of the deletion.
    */
    async deleteCommandById(_id: Types.ObjectId): Promise<void> {
        try {
            // Intentar eliminar el comando con el _id proporcionado
            const result = await this.commandModel.deleteOne({ _id }).exec();

            // Verificar si algún documento fue eliminado
            if (result.deletedCount === 0) {
                throw new HttpException('Command not found', HttpStatus.NOT_FOUND);
            }

            this._appGateway.emitEvent(commandSocket.delete, {
                ok: true,
                _id,
                msg: "Command delete succesfully",
            });
        } catch (error) {
            // Si la excepción ya es de tipo HttpException, simplemente vuelve a lanzarla
            if (error instanceof HttpException) {
                throw error;
            }
            // Para cualquier otro error, lanza una excepción genérica
            throw new HttpException('Error deleting the command', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}