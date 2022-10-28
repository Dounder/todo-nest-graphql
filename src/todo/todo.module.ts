import { AuthModule } from './../auth/auth.module';
import { Todo } from './entities/todo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoResolver } from './todo.resolver';

@Module({
  providers: [TodoResolver, TodoService],
  imports: [ConfigModule, TypeOrmModule.forFeature([Todo]), AuthModule],
  exports: [TypeOrmModule, TodoService],
})
export class TodoModule {}
