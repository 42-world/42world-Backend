export const MailServiceToken = Symbol('MailService');

export interface MailService {
  send(name: string, email: string, code: string, githubId: string);
}
