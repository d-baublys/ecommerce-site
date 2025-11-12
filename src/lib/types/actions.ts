export type CreateUpdateDeleteActionResponse<T = void> = Promise<
    | (T extends void ? { success: true } : { success: true; data: T })
    | { success: false; error?: string }
>;

export type GetActionResponse<T> = Promise<{ data: T | null }>;

export type GetManyActionResponse<T> = Promise<{ data: T[] }>;
