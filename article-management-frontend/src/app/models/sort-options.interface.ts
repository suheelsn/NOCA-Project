export type SortField =
    | 'articleNumber'
    | 'name'
    | 'articleCategory'
    | 'bicycleCategory'
    | 'material'
    | 'lengthInMm'
    | 'widthInMm'
    | 'heightInMm'
    | 'netWeightInGramm'
    | 'createdAt'
    | 'updatedAt';

export type SortDirection = 'asc' | 'desc';

export interface SortOptions {
    field: SortField;
    direction: SortDirection;
}