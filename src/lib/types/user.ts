import { z } from "zod";
import { userCreateSchema, userSchema } from "../schemas";

export type User = z.infer<typeof userSchema>;
export type UserCreateInput = z.input<typeof userCreateSchema>;
