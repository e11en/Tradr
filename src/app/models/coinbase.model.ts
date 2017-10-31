export class CoinbaseAccount {
    public Id: string;
    public Balance: { 
        amount: string,
        currency: string
    };
    public Name: string;
    public NativeBalance: {
        amount: string,
        currency: string
    }
    public IsPrimary: boolean;
    public Resource: string;
    public ResourcePath: string;
    public Type: string;
    public UpdatedAt: Date;
}
  
export class CoinbaseInstance {
    public Accounts: CoinbaseAccount[]
}