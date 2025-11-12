import { SetStateAction } from "react";

export type StateSetter<T> = React.Dispatch<SetStateAction<T>>;
