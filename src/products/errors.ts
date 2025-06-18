export class ProductSlugAlreadyExistsError extends Error{
    constructor(slug: string | undefined){
        super(`Product with slug ${slug} already exists`);
        this.name = 'ProductSlugAlreadyExistsError';
    }
}