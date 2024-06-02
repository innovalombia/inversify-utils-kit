import 'reflect-metadata';

import { GenerateStringNewOrderRequestModel } from '../StringsAdapter';
import { YmlStringsAdapter } from './YmlStringsAdapter';

const EVENT: GenerateStringNewOrderRequestModel = {
    env: 'pro',
    createdAt: '',
    customer: {
        email: '',
        firstName: '',
        lastName: '',
        phone: ''
    },
    deliveryIn: '',
    deliveryOption: '',
    deliveryPrice: 1,
    deliveryStatus: '',
    id: 1,
    paymentMethod: '',
    paymentStatus: '',
    references: [],
    referencesValueWithDiscount: '',
    total: '',
    uuid: '',
    appliedDiscountPerOrder: ''
};

describe('YmlStringsAdapter Test Suite', () => {
    let adapter: YmlStringsAdapter;

    beforeEach(() => {
        adapter = new YmlStringsAdapter();
    });

    it('should be defined', () => {
        expect(adapter).toBeDefined();
    });

    it('should format money', async () => {
        expect(adapter.generateStringNewOrder(EVENT)).toBeTruthy();
    });
});
