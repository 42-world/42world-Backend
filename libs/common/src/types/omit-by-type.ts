export type OmitByType<T, U> = Pick<T, { [K in keyof T]: T[K] extends U ? never : K }[keyof T]>;
