import { injectable } from 'inversify';
import YAML from 'yaml';

import {
    GenerateStringNewOrderRequestModel,
    StringsAdapter
} from '../StringsAdapter';

@injectable()
export class YmlStringsAdapter implements StringsAdapter {
    public generateStringNewOrder(
        payload: GenerateStringNewOrderRequestModel
    ): string {
        const message = `😃😃 Nueva orden ${
            payload.env === 'pro' ? '' : `${payload.env}`
        } 😃😃 #${payload.id} / ${payload.uuid}
Orden 🚚:
 - Costo entrega : ${payload.deliveryPrice}
 - Valor productos : ${payload.referencesValueWithDiscount}
 - Total : ${payload.total}
 - Tipo de entrega : ${payload.deliveryOption}
 - Metodo de pago : ${payload.paymentMethod}
 - Estado de pago : ${payload.paymentStatus}
 - Fecha de creación: ${payload.createdAt}
 - Fecha de entrega estimada: ${payload.deliveryIn}
Cliente 👤:
 - Nombres : ${payload.customer.firstName} ${payload.customer.lastName}
 - Célular : ${payload.customer.phone}
 - Correo : ${payload.customer.email}
${
    payload.home
        ? `Dirección de entrega 🗺️:    
    - Ciudad: ${payload.home.city}
    - Dirección: ${payload.home.address} ${payload.home.addressComplement}
    - Barrio: ${payload.home.neighborhood}
    - Persona que recibe: ${payload.home.receiverName}
    - Célular: ${payload.home.receiverPhone}`
        : ''
} 
${
    payload.merchant
        ? `Tienda de entrega 🏣:    
    - Ciudad: ${payload.merchant.city}
    - Dirección: ${payload.merchant.address} ${payload.merchant.addressComplement}
    - Barrio: ${payload.merchant.neighborhood}
    - Célular: ${payload.merchant.phone}`
        : ''
} 
Referencias 🛍:
${YAML.stringify(
    payload.references.map((item) => ({
        'Código de barras': item.barcode,
        Nombre: item.name,
        'Unidades Compradas': item.quantity,
        'Precio Unidad': item.priceOffer,
        Talla: item.size,
        Color: item.color,
        Stock: item.stock
    }))
)}
`.replaceAll('_', '');

        return message;
    }
}
