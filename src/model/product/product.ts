import { ProductStatus } from 'src/app/enum/product-status.enum';
import { ProductType } from 'src/app/enum/product-type.enum';

export default interface Product {
    _id: string;
    name: string;
    productType: ProductType;
    price: number;
    stock: number;
    status: ProductStatus;
}