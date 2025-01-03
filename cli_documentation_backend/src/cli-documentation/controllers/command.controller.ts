import { Body, Controller, Get, HttpException, HttpStatus, Delete, Post, Param } from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommandService } from '../services/command/command.service';
import { CreateCommandDto } from '../dtos/create-command.dto';
import { Types } from 'mongoose';

@Controller('cli-documentation/v1/commands')
@ApiTags("API's for commands")
export class CommandController {
  constructor(private readonly _CommandService: CommandService) {}

  /**
   * Retrieves all commands.
   * @returns {Promise<any>} List of all commands.
  */
  @Get('getAll')
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all commands.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async findAll() {
    try {
      const commands = await this._CommandService.findAll();
      return { statusCode: HttpStatus.OK, message: 'Commands retrieved successfully', data: commands };
    } catch (error) {
      throw new HttpException('Error fetching commands', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Retrieves all commands by groupId.
   * @param {string} groupId - The group ID to filter the commands.
   * @returns {Promise<any>} List of commands related to the provided groupId.
  */
  @Get('getByGroupId/:groupId')
  @ApiParam({
    name: 'groupId',
    type: String,
    description: 'Its a mongo ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved commands for the group.',
  })
  @ApiResponse({
    status: 404,
    description: 'Group not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async findByGroupId(@Param('groupId') groupId: Types.ObjectId) {
    return await this._CommandService.getCommandsByGroupId(groupId);
  }

  /**
   * Creates a new command.
   * @param {CreateCommandDto} CreateCommandDto - DTO for creating a command.
   * @returns {Promise<any>} The created command.
  */
  @Post('create')
  @ApiBody({
    description: 'Create a new command',
    type: CreateCommandDto,
    examples: {
      createNewCommand: {
        value: {
          groupId: 'group123',
          command: 'exampleCommand',
          description: 'A sample command',
          includeExample: true,
          example: 'Sample Example',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Command successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request payload.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async create(@Body() CreateCommandDto: CreateCommandDto) {
    try {
      const createdCommand = await this._CommandService.create(CreateCommandDto);
      return { statusCode: HttpStatus.CREATED, message: 'Command created successfully', data: createdCommand };
    } catch (error) {
      if (error.status === HttpStatus.BAD_REQUEST) {
        throw new HttpException('Invalid request payload', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Error creating command', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Deletes multiple commands and removes their references from groups.
   * @param {Types.ObjectId[]} commandIds - Array of command IDs to be deleted.
   * @returns {Promise<any>} Confirmation message of successful deletion.
  */
  @Delete('delete')
  @ApiBody({
    description: 'Delete multiple commands and remove their references from groups',
    schema: {
      type: 'object',
      properties: {
        commandIds: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Commands deleted successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request payload.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async deleteCommands(@Body('commandIds') commandIds: Types.ObjectId[]) {
    try {
      const result = await this._CommandService.deleteCommands(commandIds);
      return {
        statusCode: HttpStatus.OK,
        message: 'Commands deleted successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException('Error deleting commands', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('delete-command/:_id')
  @ApiParam({
    name: '_id',
    type: String,
    description: 'Its a mongo ID',
    required: true,
  })
  async deleteCommand(@Param('_id') _id: Types.ObjectId) {
    try {
      await this._CommandService.deleteCommandById(_id);
      return {
        statusCode: HttpStatus.OK,
        message: `Command ${_id} deleted successfully`,
      };
    } catch (error) {
      throw new HttpException('Error deleting command', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}