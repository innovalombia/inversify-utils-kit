export interface MoneyFormatterAdapter {
    toMoneyFormat(money: number): string;
}

export const MONEY_FORMATTER_ADAPTER_TYPE = Symbol(
    'MONEY_FORMATTER_ADAPTER_TYPE'
);
