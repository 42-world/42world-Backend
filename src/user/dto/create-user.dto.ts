export class CreateUserDto {
  readonly nickname!: string;
  readonly oauth_token!: string;
  readonly last_login?: Date;
}
