export default interface MailService {
  send(name: string, code: string, githubId: string);
}
