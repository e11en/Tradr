import { Currency } from './currency.model';

export class CoinbaseAccount {
    public Balance: { 
        amount: string,
        currency: string
    };
    public Name: string;
    public NativeBalance: {
        amount: string,
        currency: string
    };
    public Id: string;
    public IsPrimary: boolean;
    public Resource: string;
    public ResourcePath: string;
    public Type: string;
    public UpdatedAt: Date;

    constructor(account?: any) {
        if(account) {
            this.Balance = {
                amount: account.balance.amount,
                currency: account.balance.currency
            };
            this.Id = account.id;
            this.Name = account.name;
            this.NativeBalance = {
                amount: account.native_balance.amount,
                currency: account.native_balance.currency
            };
            this.IsPrimary = account.primary;
            this.Resource = account.resource;
            this.ResourcePath = account.resource_path;
            this.Type = account.type;
            this.UpdatedAt = account.updated_at;
        }
    }
}
  
export class CoinbaseInstance {
    public Accounts: CoinbaseAccount[]
}