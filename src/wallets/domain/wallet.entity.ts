export class WalletEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly balance: number,
    public readonly currency: string,
  ) {}
}
