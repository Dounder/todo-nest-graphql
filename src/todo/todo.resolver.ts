import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GetUser } from './../auth/decorators';
import { JwtGraphqlGuard } from './../auth/guards/jwt-graphql.guard';
import { PaginationArgs } from './../common/dto/args/pagination.args';
import { SearchArgs } from './../common/dto/args/search.args';
import { User } from './../users/entities/user.entity';
import { CreateTodoInput, UpdateTodoInput } from './dto/inputs';
import { Todo } from './entities/todo.entity';
import { TodoService } from './todo.service';

@Resolver(() => Todo)
@UseGuards(JwtGraphqlGuard)
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Mutation(() => Todo)
  async createTodo(
    @Args('createTodoInput') createTodoInput: CreateTodoInput,
    @GetUser() user: User,
  ): Promise<Todo> {
    return await this.todoService.create(createTodoInput, user);
  }

  @Query(() => [Todo], { name: 'todos' })
  async findAll(
    @GetUser() user: User,
    @Args() pagination: PaginationArgs,
    @Args() search: SearchArgs,
  ): Promise<Todo[]> {
    return await this.todoService.findAll(user, pagination, search);
  }

  @Query(() => Todo, { name: 'todo' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ) {
    return this.todoService.findOne(id, user);
  }

  @Mutation(() => Todo)
  updateTodo(
    @Args('updateTodoInput') updateTodoInput: UpdateTodoInput,
    @GetUser() user: User,
  ) {
    return this.todoService.update(updateTodoInput.id, updateTodoInput, user);
  }

  @Mutation(() => Todo)
  removeTodo(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ) {
    return this.todoService.remove(id, user);
  }
}
