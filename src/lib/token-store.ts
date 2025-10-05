// In a real application, this should be a persistent store like Redis or a database.
// This is for demonstration purposes only.
// The map is reset on every server restart.
export const tokens = new Map<string, { productIds: string[]; expires: number }>();
