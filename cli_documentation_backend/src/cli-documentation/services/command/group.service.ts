import { Model, Types } from 'mongoose';
import { Injectable, Inject, HttpException, HttpStatus, forwardRef } from '@nestjs/common';
import { groupDataInterface } from 'src/cli-documentation/interfaces/group.interface';
import { CreateGroupDto } from 'src/cli-documentation/dtos/create-group.dto';
import { AddCommandToGroupDto } from 'src/cli-documentation/dtos/addCommandToGroup.dto';
import { ClientSession } from 'mongoose';
import { CommandService } from './command.service';
import { groupSocket } from 'src/cli-documentation/sockets/sockets.socket';
import { EventsGateway } from 'src/common/gateway/gateway';

@Injectable()
export class GroupService {
    constructor(
        @Inject('GROUP_MODEL') private readonly groupModel: Model<groupDataInterface>,
        @Inject(forwardRef(() => CommandService)) private readonly _CommandService: CommandService,
        private readonly _appGateway: EventsGateway
    ) {}

    /**
     * Retrieves all groups with populated commands.
     * @returns {Promise<groupDataInterface[]>} List of all groups with populated commands.
    */  
    async findAll(): Promise<groupDataInterface[]> {
        try {
            const groups = await this.groupModel.find().exec();
            return groups;
        } catch (error) {
            throw new HttpException('Error fetching groups', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Creates a new group.
     * @param {CreateGroupDto} CreateGroupDto - DTO for creating a group.
     * @returns {Promise<groupDataInterface>} The created group.
    */
    async create(CreateGroupDto: CreateGroupDto): Promise<groupDataInterface> {
        try {
            const createdGroup = new this.groupModel(CreateGroupDto);

            const savedGroup = await createdGroup.save();

            this._appGateway.emitEvent(groupSocket.create, {
                ok: true,
                data: savedGroup,
                msg: "Socket Success!",
            });

            return savedGroup;
        } catch (error) {
            throw new HttpException('Error creating group', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Adds a command to a group.
     * @param {AddCommandToGroupDto} payload - DTO containing groupId and command to add.
     * @returns {Promise<groupDataInterface>} Updated group data.
    */
    async addCommand(payload: AddCommandToGroupDto): Promise<groupDataInterface> {
        try {
            // Find the group by ID
            const instanceGroup = await this.groupModel.findById(payload.groupId);

            if (!instanceGroup) {
                throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
            }

            // Check if the command already exists
            if (instanceGroup.commands.includes(payload.command)) {
                throw new HttpException('Command already exists in group', HttpStatus.CONFLICT);
            }

            // Add the command and save the updated group
            instanceGroup.commands.push(payload.command);
            await instanceGroup.save();

            return instanceGroup.toObject();
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Error adding command to group', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Removes multiple commands from the commands array of specified groups.
     * @param {string[]} groupIds - Array of group IDs to update.
     * @param {string[]} commandIds - Array of command IDs to remove from groups.
     * @param {ClientSession} session - Mongoose transaction session.
     * @returns {Promise<string[]>} The IDs of the updated groups.
    */
    async removeCommandsFromGroups(groupIds: Types.ObjectId[], commandIds: Types.ObjectId[], session: ClientSession): Promise<Types.ObjectId[]> {
        try {
            const result = await this.groupModel.updateMany(
                { _id: { $in: groupIds } },
                { $pull: { commands: { $in: commandIds } } },
                { session }
            );

            if (result.modifiedCount === 0) {
                throw new HttpException('No groups were updated', HttpStatus.NOT_FOUND);
            }

            return groupIds;
        } catch (error) {
            throw new HttpException(`Error updating groups: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Deletes a group by its ID and associated commands.
     * @param {Types.ObjectId} groupId - ID of the group to delete.
     * @returns {Promise<string>} The ID of the deleted group.
    */
    async deleteGroup(groupId: Types.ObjectId): Promise<string> {
        const session = await this.groupModel.db.startSession();
        session.startTransaction();

        try {
            // Buscar el grupo en la base de datos
            const group = await this.groupModel.findById(groupId).session(session);

            if (!group) {
                throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
            }

            // Eliminar los comandos asociados al grupo
            for (const commandId of group.commands) {
                try {
                    // Intentar eliminar cada comando asociado
                    await this._CommandService.deleteCommandById(commandId);
                } catch (commandError) {
                    // Si no se puede eliminar un comando, abortar la transacción
                    throw new HttpException('Error deleting associated command', HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }

            // Eliminar el grupo
            await this.groupModel.findByIdAndDelete(groupId).session(session);

            // Confirmar la transacción
            await session.commitTransaction();

            // Emitir el evento de Socket tras la eliminación exitosa
            this._appGateway.emitEvent(groupSocket.delete, {
                ok: true,
                removedSuccess: true,
                msg: "Socket Success!",
            });

            // Retornar el ID del grupo eliminado
            return groupId.toString();
        } catch (error) {
            // Si algo falla, revertir la transacción
            await session.abortTransaction();
            throw new HttpException('Error deleting group and its commands', HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            // Finalizar la sesión
            session.endSession();
        }
    }
}