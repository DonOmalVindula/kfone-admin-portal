export interface Customer {
    id: string;
    name: string;
    email?: string;
    tier: string;
    points: number;
}

export enum CustomerTier {
    NONE = 'none',
    SILVER = 'silver',
    GOLD = 'gold',
    PLATINUM = 'platinum'
}