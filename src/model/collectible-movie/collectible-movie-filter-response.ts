import PaginationResponse from '../common/pagination-response.model';
import CollectibleMovieBasic from './collectible-movie-basic';

export default interface CollectibleMovieFilterResponse {
    movies: Array<CollectibleMovieBasic>;
    paginationResponse: PaginationResponse;
}