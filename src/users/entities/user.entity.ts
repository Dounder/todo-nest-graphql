import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { BaseEntity } from './../../common/entities/base.entity';
import { Todo } from './../../todo/entities/todo.entity';
import { UserRoles } from './../enum/UserRoles.enum';

@Entity('users')
@Index('username_email_IX', ['username', 'email'])
@Index('user_roles_IX', ['roles'])
@ObjectType()
export class User extends BaseEntity {
  @Column({ type: 'text', unique: true })
  @Field(() => String)
  username: string;

  @Column({ type: 'text', unique: true })
  @Field(() => String)
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: [UserRoles.user],
    array: true,
  })
  @Field(() => [UserRoles])
  roles: UserRoles[];

  @ManyToOne(() => User, (user) => user.lastUpdatedBy, {
    nullable: true,
    lazy: true,
  })
  @JoinColumn({ name: 'lastUpdatedBy' })
  @Field(() => User, { nullable: true })
  lastUpdatedBy?: User;

  @OneToMany(() => Todo, (todo) => todo.createdBy, { lazy: true })
  @Field(() => [Todo])
  todos: Todo[];
}
