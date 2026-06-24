export class TransferEntity {
  constructor(
    public readonly id: string,
    public readonly senderId: string,
    public readonly receiverId: string,
    public readonly amount: number,
    public readonly createdAt: Date,
  ) {}
}
