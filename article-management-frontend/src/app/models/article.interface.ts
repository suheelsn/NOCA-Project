export interface Article {
    id: number;
    articleNumber: number;
    name: string;
    articleCategory: string;
    bicycleCategory: string;
    material: string;
    lengthInMm: number;
    widthInMm: number;
    heightInMm: number;
    netWeightInGramm: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateArticle {
    articleNumber: number;
    name: string;
    articleCategory: string;
    bicycleCategory: string;
    material: string;
    lengthInMm: number;
    widthInMm: number;
    heightInMm: number;
    netWeightInGramm: number;
}

export interface UpdateArticle {
    articleNumber: number;
    name: string;
    articleCategory: string;
    bicycleCategory: string;
    material: string;
    lengthInMm: number;
    widthInMm: number;
    heightInMm: number;
    netWeightInGramm: number;
}