export type BaseActions =
    | 'create' | 'findById' | 'findOne' | 'findMany'
    | 'update' | 'remove' | 'page'
    | 'custom'; // custom for complex queries not covered by the basic actions
