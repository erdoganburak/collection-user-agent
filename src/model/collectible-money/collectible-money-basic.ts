import ClippingBasic from '../clipping/clipping-basic.model';
import ImageBuffer from '../common/image-buffer.model';
import EmissionBasic from '../emission/emission-basic.model';

export default interface CollectibleMoneyBasic {
    _id: string;
    name: string;
    productType: string;
    productNo: string;
    condition: number;
    serialNo: string;
    emission: EmissionBasic;
    clipping: ClippingBasic;
    price: number;
    frontImage: string,
    backImage: string
}