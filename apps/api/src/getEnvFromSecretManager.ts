import { PHASE } from '@app/utils/phase';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

export const getEnvFromSecretManager = async (): Promise<Record<string, string>> => {
  if (PHASE === 'dev' || PHASE === 'test') {
    return {};
  }

  const secretName = `${PHASE}/rookies/api`;

  console.log(`[${new Date().toISOString()}] Fetch secret from ${secretName}...`);

  const client = new SecretsManagerClient({
    region: 'ap-northeast-2',
  });
  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: secretName,
      VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
    }),
  );
  console.log(`[${new Date().toISOString()}] Fetch secret from ${secretName}... Done!`);

  const secrets = JSON.parse(response.SecretString);

  // TODO: add validate
  return secrets;
};
