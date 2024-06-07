import 'reflect-metadata';

import { injectable } from 'inversify';
import numeral from 'numeral';

import { MoneyFormatterAdapter } from '../MoneyFormatterAdapter';

@injectable()
export class NumeralMoneyFormatterAdapter implements MoneyFormatterAdapter {
    toMoneyFormat(value: number): string {
        return numeral(value).format('$ 0,0[.]00');
    }
}
