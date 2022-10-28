import { Field, InputType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateTodoInput {
  @Field(() => String)
  @MinLength(2)
  @MaxLength(500)
  text: string;
}
