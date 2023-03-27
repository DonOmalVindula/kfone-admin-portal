export interface Device {
    id: string;
    name: string;
    imageUrl?: string;
    price?: number;
    description?: string;
    category?: DeviceCategory;
    promoCodes?: PromoCode[]
}

export interface PromoCode {
    id: string;
    code: string;
    discount: number;
}

export enum DeviceCategory {
    PHONE = 'phone',
    WEARABLE = 'wearable',
    TABLET = 'tablet'
}

