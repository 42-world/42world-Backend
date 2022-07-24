export const UnsubscribeStibeeServiceToken = Symbol('UnsubscribeStibee');

export interface UnsubscribeStibeeService {
  unsubscribe(name: string);
}
