import { z } from "zod";
import { reservationCreateSchema, reservationSchema } from "../schemas/reservation";

export type Reservation = z.infer<typeof reservationSchema>;

export type ReservationCreateInput = z.infer<typeof reservationCreateSchema>;
