import { Slack } from '@app/entity/slack/slack.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Slack)
export class SlackRepository extends Repository<Slack> {}
