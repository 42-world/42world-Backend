export const MAIL_SERVICE_TOKEN = Symbol('MailService');

export interface MailService {
  send(name: string, email: string, code: string, githubId: string);
}
