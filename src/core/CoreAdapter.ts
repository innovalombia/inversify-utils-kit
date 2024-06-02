export interface CreateUserRequestModel {
    email: string;
    firstName: string;
    lastName: string;
    username: string;
}

export interface ConfirmOrderRequestModel {
    paymentTransactionRef: string;
    paymentStatus: string;
    paymentMethod: string;
}

export interface CoreAdapter {
    createUser(payload: CreateUserRequestModel): Promise<void>;
    confirmOrder(payload: ConfirmOrderRequestModel): Promise<void>;
}

export const CORE_ADAPTER_TYPE = Symbol('CORE_ADAPTER_TYPE');
