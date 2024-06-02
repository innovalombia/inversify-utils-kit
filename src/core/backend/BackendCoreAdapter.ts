import axios from 'axios';
import { inject, injectable } from 'inversify';

import {
    ConfirmOrderRequestModel,
    CoreAdapter,
    CreateUserRequestModel
} from '../CoreAdapter';

export const BACKEND_CORE_API_KEY_CONST_TYPE = Symbol(
    'BACKEND_CORE_API_KEY_CONST_TYPE'
);
export const BACKEND_CORE_API_URL_CONST_TYPE = Symbol(
    'BACKEND_CORE_API_URL_CONST_TYPE'
);

@injectable()
export class BackendCoreAdapter implements CoreAdapter {
    constructor(
        @inject(BACKEND_CORE_API_KEY_CONST_TYPE)
        private _BACKEND_CORE_API_KEY: string,
        @inject(BACKEND_CORE_API_URL_CONST_TYPE)
        private _BACKEND_CORE_API_URL: string
    ) {}
    async createUser(payload: CreateUserRequestModel): Promise<void> {
        await axios.post(
            `${this._BACKEND_CORE_API_URL}/users/pre-signup`,
            payload,
            {
                headers: { 'x-api-key': this._BACKEND_CORE_API_KEY }
            }
        );
    }
    async confirmOrder(payload: ConfirmOrderRequestModel): Promise<void> {
        await axios.post(
            `${this._BACKEND_CORE_API_URL}/orders/confirm`,
            payload,
            {
                headers: { 'x-api-key': this._BACKEND_CORE_API_KEY }
            }
        );
    }
}
