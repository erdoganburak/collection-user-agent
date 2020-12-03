import { MovieFormat } from 'src/app/enum/movie-format.enum';
import ActorBasic from '../actor/actor-basic.model';
import CategoryBasic from '../category/category-basic.model';
import DirectorBasic from '../director/director-basic.model';
import Product from '../product/product';

export default interface CollectibleMovieBasic extends Product {
    actors: Array<ActorBasic>;
    directors: Array<DirectorBasic>;
    categories: Array<CategoryBasic>;
    summary: string;
    condition: number;
    duration: number;
    year: number;
    format: MovieFormat;
    frontImage: string
}