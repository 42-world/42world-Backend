import { toHTML } from 'slack-markdown';

export const parseMessage = (
  text: string,
  ts: string,
  channel: string,
): { title: string; content: string } => {
  const title = text.split('\n')[0];
  const t = ts.replace(/'.'/g, '');
  const link = `https://${process.env.SLACK_WORKSPACE_NAME}.slack.com/archives/${channel}/${t}`;

  const content =
    toHTML(text)
      .replace(/<del>/g, '~')
      .replace(/<\/del>/g, '~') + `\n\n (슬랙으로 이동)[${link}]`;

  return { title, content };
};
