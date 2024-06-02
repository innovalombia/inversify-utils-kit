import { injectable } from 'inversify';
import numeral from 'numeral';

import { MoneyAdapter } from '../MoneyAdapter';

@injectable()
export class NumeralMoneyAdapter implements MoneyAdapter {
    toMoneyFormat(value: number): string {
        return numeral(value).format('$ 0,0[.]00');
    }
}
