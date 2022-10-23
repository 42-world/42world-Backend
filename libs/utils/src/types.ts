// export type AwaitedObject<T> = {
//   [P in keyof T]: T[P] extends Promise<infer U> ? U : T[P];
// };

// export type OmitByType<T, U> = Pick<T, { [K in keyof T]: T[K] extends U ? never : K }[keyof T]>;

// export type ReadOnlyObject<T> = {
//   readonly [P in keyof T]: T[P];
// };

// export type VO<T> = ReadOnlyObject<OmitByType<AwaitedObject<T>, Function>>;
