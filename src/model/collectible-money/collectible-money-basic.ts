import ClippingBasic from '../clipping/clipping-basic.model';
import EmissionBasic from '../emission/emission-basic.model';
import Product from '../product/product';

export default interface CollectibleMoneyBasic extends Product {
    productNo: string;
    condition: number;
    serialNo: string;
    emission: EmissionBasic;
    clipping: ClippingBasic;
    frontImage: string,
    backImage: string
}