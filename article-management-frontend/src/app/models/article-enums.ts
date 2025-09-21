export enum ArticleCategory {
    HUB = 'Hub',
    CRANK_ARM = 'Crank arm'
}

export enum BicycleCategory {
    E_CARGO_BIKE = 'e-Cargo bike',
    ROAD = 'Road',
    GRAVEL = 'Gravel',
    E_GRAVEL = 'e-Gravel',
    E_TREKKING = 'e-Trekking',
    E_CITY = 'e-City',
    FOLDABLE = 'Foldable'
}

export enum Material {
    ALUMINIUM = 'Aluminium',
    STEEL = 'Steel',
    ALLOY = 'Alloy',
    CARBON = 'Carbon',
    NICKEL = 'Nickel'
}

// Helper functions to get enum values as arrays
export const getArticleCategories = (): string[] => {
    return Object.values(ArticleCategory);
};

export const getBicycleCategories = (): string[] => {
    return Object.values(BicycleCategory);
};

export const getMaterials = (): string[] => {
    return Object.values(Material);
};