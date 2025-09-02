export interface MoneyFormatterAdapter {
    toMoneyFormat(money: number): string;
}

export const MONEY_FORMATTER_ADAPTER_TYPE = Symbol.for(
    'MONEY_FORMATTER_ADAPTER_TYPE'
);
