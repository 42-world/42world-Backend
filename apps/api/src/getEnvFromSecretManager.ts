import { PHASE } from '@app/utils/phase';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

export const getEnvFromSecretManager = async (): Promise<Record<string, string>> => {
  if (PHASE === 'dev' || PHASE === 'test') {
    return {};
  }

  const secret_name = `${PHASE}/rookies/api`;

  const client = new SecretsManagerClient({
    region: 'ap-northeast-2',
  });
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
