export type CreateUpdateDeleteActionResponse = Promise<
    { success: true } | { success: false; error?: string }
>;

export type GetActionResponse<T> = Promise<{ data: T | null }>;

export type GetManyActionResponse<T> = Promise<{ data: T[] }>;
