import { PHASE } from '@app/utils/env';
import {
  GetSecretValueCommand,
  SecretsManagerClient,
  SecretsManagerClientConfig,
} from '@aws-sdk/client-secrets-manager';

export const getEnvFromSecretManager = async () => {
  const secret_name = `${PHASE}/rookies/api`;

  const config: SecretsManagerClientConfig = {
    region: 'ap-northeast-2',
  };

  if (PHASE === 'dev') {
    config.credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    };
  }

  const client = new SecretsManagerClient(config);

  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: secret_name,
      VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
    }),
  );

  const secrets = JSON.parse(response.SecretString);

  // TODO: add validate
  return secrets;
};
