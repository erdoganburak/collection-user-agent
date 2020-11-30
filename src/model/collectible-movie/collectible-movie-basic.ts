import { MovieFormat } from 'src/app/enum/movie-format.enum';
import { ProductType } from 'src/app/enum/product-type.enum';
import ActorBasic from '../actor/actor-basic.model';
import CategoryBasic from '../category/category-basic.model';
import DirectorBasic from '../director/director-basic.model';

export default interface CollectibleMovieBasic {
    _id: string;
    actors: Array<ActorBasic>;
    directors: Array<DirectorBasic>;
    categories: Array<CategoryBasic>;
    productType: ProductType;
    name: string;
    summary: string;
    condition: number;
    price: number;
    duration: number;
    year: number;
    format: MovieFormat;
    frontImage: string
}