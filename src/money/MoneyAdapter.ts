export interface MoneyAdapter {
    toMoneyFormat(money: number): string;
}

export const MONEY_ADAPTER_TYPE = Symbol('MONEY_ADAPTER_TYPE');
