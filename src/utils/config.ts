export enum EnvConstants {
  MESSAGE_QUEUE_PORTS = 'MQ_PORTS',
  MESSAGE_QUEUE_GROUP_ID = 'MQ_GROUP_ID',
  BASE_TOPIC_ID = 'test',
  MESSAGE_QUEUE_CLIENT_ID = 'MQ_CLIENT_ID',
}

export function getBrokersFromPorts(host: string, ports: string): string[] {
  const brokers = ports.split(',').map((port) => `${host}:${port}`);
  console.log('Brokers: ', brokers);
  return brokers;
}

export enum KafkaTopics {
  TEST = 'test',
  RUST_CONSUMER = 'rust-consumer',
}
