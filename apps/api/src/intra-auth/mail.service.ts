export default abstract class MailService {
  abstract send(templateName: string, nickname: string, code: string, endpoint: string, githubId: string);
}
