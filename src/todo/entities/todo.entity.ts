import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from './../../common/entities/base.entity';
import { User } from './../../users/entities/user.entity';

@Entity('todos')
@ObjectType()
export class Todo extends BaseEntity {
  @Column({ type: 'text' })
  @MinLength(2)
  @MaxLength(500)
  @Field(() => String)
  text: string;

  @ManyToOne(() => User, (user) => user.todos, { nullable: false, lazy: true })
  @JoinColumn({ name: 'createdBy' })
  @Field(() => User)
  createdBy: User;
}
