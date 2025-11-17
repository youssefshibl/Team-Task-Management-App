import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto, UpdateTaskStatusDto, PaginationDto } from './task.dto';
import { Auth } from 'src/lib/decorators/auth.decorator';
import { UserRole } from 'src/lib/enums/user.enum';
import { IJwtPayload } from 'src/lib/interfaces/auth.interface';
import { TaskService } from './task.service';
import { User } from 'src/lib/decorators/user.decorator';
import { TaskResponseMapper } from 'src/lib/utils/task-response.mapper';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('create')
  @Auth({ role: UserRole.TEAM_LEAD })
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @User() user: IJwtPayload,
  ) {
    const task = await this.taskService.create(createTaskDto, user.id);
    if (!task) {
      throw new NotFoundException('Task not created');
    }
    return {
      message: 'Task created successfully',
      data: TaskResponseMapper.toResponse(task),
    };
  }

  @Get('get-all')
  @Auth({ role: UserRole.TEAM_LEAD })
  async findAll(
    @User() user: IJwtPayload,
    @Query() paginationDto: PaginationDto,
  ) {
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;

    const result = await this.taskService.findAllWithPagination(
      user.id,
      page,
      limit,
    );

    return {
      message: 'Tasks fetched successfully',
      data: TaskResponseMapper.toResponseArray(result.data),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  @Get('assigned-to-me')
  @Auth({ role: UserRole.MEMBER })
  async getTasksAssignedToMe(
    @User() user: IJwtPayload,
    @Query() paginationDto: PaginationDto,
  ) {
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;

    const result = await this.taskService.getTasksAssignedToMeWithPagination(
      user.id,
      page,
      limit,
    );

    return {
      message: 'Tasks fetched successfully',
      data: TaskResponseMapper.toResponseArray(result.data),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  @Get('statistics')
  @Auth({ role: UserRole.TEAM_LEAD })
  async getStatistics(@User() user: IJwtPayload) {
    const statistics = await this.taskService.getStatistics(user.id);
    return {
      message: 'Statistics fetched successfully',
      data: statistics,
    };
  }

  @Get(':id')
  @Auth({ role: UserRole.TEAM_LEAD })
  async findOne(@Param('id') id: string) {
    const task = await this.taskService.findOne(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return {
      message: 'Task fetched successfully',
      data: TaskResponseMapper.toResponse(task),
    };
  }

  @Put(':id')
  @Auth({ role: UserRole.TEAM_LEAD })
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const task = await this.taskService.update(id, updateTaskDto);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return {
      message: 'Task updated successfully',
      data: TaskResponseMapper.toResponse(task),
    };
  }

  @Delete(':id')
  @Auth({ role: UserRole.TEAM_LEAD })
  async remove(@Param('id') id: string) {
    const task = await this.taskService.remove(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return { message: 'Task deleted successfully' };
  }

  @Put(':id/status')
  @Auth({ role: UserRole.MEMBER })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @User() user: IJwtPayload,
  ) {
    const task = await this.taskService.updateStatus(
      id,
      updateTaskStatusDto.status,
      user.id,
    );
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return {
      message: 'Task status updated successfully',
      data: TaskResponseMapper.toResponse(task),
    };
  }
}
