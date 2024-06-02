/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { injectable } from 'inversify';

import { Logger } from '../Logger';

@injectable()
export class FakeLogger implements Logger {
    constructor() {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public debug(...args: any): void {
        console.debug.apply(null, args);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public error(...args: any): void {
        console.error.apply(null, args);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public info(...args: any): void {
        console.info.apply(null, args);
    }
}
