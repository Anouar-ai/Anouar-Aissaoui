// In a real application, this should be a persistent store like Redis or a database.
// This is for demonstration purposes only.
export const tokens = new Map<string, { productIds: string[]; expires: number }>();
