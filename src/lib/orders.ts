import type { Order } from '@/types';

export const orders: Order[] = [
    {
        id: 'ORD-2024-789123',
        date: '2024-07-15',
        status: 'Delivered',
        total: 118.99,
        items: [
            {
                productName: 'Rank Math Pro',
                licenseKey: 'RM-PRO-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
            },
            {
                productName: 'WP Rocket Premium',
                licenseKey: 'WPR-PRE-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
            },
        ],
    },
    {
        id: 'ORD-2024-456789',
        date: '2024-05-20',
        status: 'Delivered',
        total: 59.00,
        items: [
            {
                productName: 'GeneratePress Premium',
                licenseKey: 'GPP-PRE-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
            },
        ],
    },
    {
        id: 'ORD-2023-123456',
        date: '2023-11-01',
        status: 'Delivered',
        total: 49.99,
        items: [
            {
                productName: 'Elementor Pro',
                licenseKey: 'ELM-PRO-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
            },
        ],
    },
];
