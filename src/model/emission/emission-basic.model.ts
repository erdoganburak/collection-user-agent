import ClippingBasic from '../clipping/clipping-basic.model';

export default interface EmissionBasic {
    _id: string;
    name: string;
    clippings: Array<ClippingBasic>
}


