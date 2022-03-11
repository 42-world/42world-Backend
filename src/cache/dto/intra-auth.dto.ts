export class IntraAuthMailDto {
  readonly userId: number;
  readonly intraId: string;

  constructor(userId: number, intraId: string) {
    this.userId = userId;
    this.intraId = intraId;
  }
}
