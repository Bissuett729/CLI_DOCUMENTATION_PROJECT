import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateGroupDto } from '../dtos/create-group.dto';
import { GroupService } from '../services/command/group.service';
import { Types } from 'mongoose';

@Controller('cli-documentation/v1/groups')
@ApiTags("API's for group")
export class GroupController {
  constructor(private readonly _GroupService: GroupService) {}

  /**
   * Retrieves all groups.
   * @returns {Promise<any>} List of all groups.
  */
  @Get('getAll')
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all groups.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async findAll() {
    try {
      const groups = await this._GroupService.findAll();
      return { statusCode: HttpStatus.OK, message: 'Groups retrieved successfully', data: groups };
    } catch (error) {
      throw new HttpException('Error fetching groups', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Creates a new group.
   * @param {CreateGroupDto} CreateGroupDto - DTO for creating a group.
   * @returns {Promise<any>} The created group.
  */
  @Post('create')
  @ApiBody({
    description: 'Create a new group',
    type: CreateGroupDto,
    examples: {
      createNewGroup: {
        value: {
          label: 'Group Label',
          icon: 'icon_url',
          url: 'group_url',
          value: 'group_value',
          colorLabel: '#FFFFFF',
          link: 'link of the documentation',
          commands: [],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Group successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request payload.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async create(@Body() CreateGroupDto: CreateGroupDto) {
    try {
      const createdGroup = await this._GroupService.create(CreateGroupDto);
      return { statusCode: HttpStatus.CREATED, message: 'Group created successfully', data: createdGroup };
    } catch (error) {
      if (error.status === HttpStatus.BAD_REQUEST) {
        throw new HttpException('Invalid request payload', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Error creating group', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Deletes a group by its ID.
   * @param {string} groupId - ID of the group to delete.
   * @returns {Promise<any>} The ID of the deleted group.
  */
  @Delete('delete/:groupId')
  @ApiResponse({
    status: 200,
    description: 'Group deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Group not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async delete(@Param('groupId') groupId: string) {
    try {
      const deletedGroupId = await this._GroupService.deleteGroup(new Types.ObjectId(groupId));
      return {
        statusCode: HttpStatus.OK,
        message: 'Group deleted successfully',
        data: deletedGroupId,
      };
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Error deleting group', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}