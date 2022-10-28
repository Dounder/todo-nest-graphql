import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationArgs, SearchArgs } from './../common/dto/args';
import { HandleExceptions } from './../common/helpers/handle-exception.helper';
import { User } from './../users/entities/user.entity';
import { CreateTodoInput, UpdateTodoInput } from './dto/inputs';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async create(createTodoInput: CreateTodoInput, user: User): Promise<Todo> {
    try {
      const todo = this.todoRepository.create({
        ...createTodoInput,
        createdBy: user,
      });
      return await this.todoRepository.save(todo);
    } catch (error) {
      HandleExceptions(error);
    }
  }

  async findAll(
    user: User,
    pagination: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<Todo[]> {
    const { limit, offset } = pagination;
    const { search } = searchArgs;
    const { id } = user;

    const query = this.todoRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where('"createdBy" = :id', { id });

    if (search) query.andWhere('"text" ilike :text', { text: search });

    return await query.getMany();
  }

  async findOne(id: string, user: User): Promise<Todo> {
    try {
      return await this.todoRepository.findOneByOrFail({
        id,
        createdBy: { id: user.id },
      });
    } catch (error) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
  }

  async update(
    id: string,
    updateTodoInput: UpdateTodoInput,
    user: User,
  ): Promise<Todo> {
    const todo = await this.findOne(id, user);
    return await this.todoRepository.save({ ...todo, ...updateTodoInput });
  }

  async remove(id: string, user: User): Promise<Todo> {
    const todo = await this.findOne(id, user);
    await this.todoRepository.remove(todo);
    return { ...todo, id };
  }
}
