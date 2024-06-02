export type GenerateStringNewOrderRequestModel = {
    id: number;
    env: string;
    uuid: string;
    paymentMethod: string;
    deliveryOption: string;
    appliedDiscountPerOrder?: string;
    referencesValueWithDiscount: string;
    deliveryPrice: number;
    paymentStatus: string;
    deliveryIn: string;
    createdAt: string;
    deliveryStatus: string;
    total: string;
    references: {
        barcode: string;
        price: string;
        priceOffer: string;
        quantity: number;
        stock: number;
        size: string;
        color: string;
        name: string;
        slug: string;
        image: { url: string; alt: string };
    }[];
    customer: {
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
    };
    merchant?: {
        name: string;
        address: string;
        addressComplement: string;
        neighborhood: string;
        city: string;
        phone: string;
    };
    home?: {
        address: string;
        addressComplement: string;
        neighborhood: string;
        city: string;
        receiverPhone: string;
        receiverName: string;
    };
};

export interface StringsAdapter {
    generateStringNewOrder(payload: GenerateStringNewOrderRequestModel): string;
}

export const STRING_ADAPTER_TYPE = Symbol('STRING_ADAPTER_TYPE');
