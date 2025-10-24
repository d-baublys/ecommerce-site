import { z } from "zod";
import { clientUserSchema, userCreateSchema, userSchema } from "../schemas";

export type User = z.infer<typeof userSchema>;
export type ClientUser = z.infer<typeof clientUserSchema>;
export type UserCreateInput = z.input<typeof userCreateSchema>;
