const DEFAULT_PAGE = 1;
const MAX_PAGE = 20;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const ALLOWED_SORT_FIELD = new Set(['price', 'createdAt', 'name', 'rating']);

export const queryBuilder = (query = {}) => {
    const where = {};
    const orderBy = [];

    if (query.category) {
        const categories = String(query.category).split(',').map(cat => cat.trim().toLowerCase());

        where.category = categories.length === 1
        ? { equals: categories[0] }
        : { in: categories };
    }

    if (query.subcategory) {
        const subcategories = String(query.subcategory).split(',').map(subcat => subcat.trim().toLowerCase());

        where.subcategory = subcategories.length === 1
        ? { equals: subcategories[0] }
        : { in: subcategories };
    }

    if (query.minPrice || query.maxPrice) {
        where.price = {};

        if (query.minPrice) where.price.gte = Number(query.minPrice);
        if (query.maxPrice) where.price.lte = Number(query.maxPrice);
    }

    if (query.q) {
        where.OR = [
            { name: { contains: query.q, mode: 'insensitive' }},
            { description: { contains: query.q, mode: 'insensitive' }}
        ];
    }
    
    if (query.sort) {
        const fields = query.sort.split(',').map(field => field.trim());

        for (const field of fields) {
            const desc = field.startsWith('-');
            const sortField = desc ? field.slice(1) : field;

            if (ALLOWED_SORT_FIELD.has(sortField)) {
                orderBy.push({
                    [sortField]: desc ? 'desc' : 'asc'
                });
            }
        }
    }
    if (orderBy.length === 0) orderBy.push({ createdAt: 'desc' });

    const page = Math.min(Math.max(Number(query.page) || DEFAULT_PAGE) , MAX_PAGE);
    const limit = Math.min(Math.max(Number(query.limit) || DEFAULT_LIMIT), MAX_LIMIT);
    const skip = (page - 1) * limit;
    const take = limit;

    return {
        where,
        orderBy,
        page,
        skip,
        take,
    };
}