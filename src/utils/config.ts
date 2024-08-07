export enum EnvConstants {
  MESSAGE_QUEUE_PORTS = 'MQ_PORTS',
  MESSAGE_QUEUE_GROUP_ID = 'MQ_GROUP_ID',
  BASE_TOPIC_ID = 'test',
  MESSAGE_QUEUE_CLIENT_ID = 'MQ_CLIENT_ID',
}

export function getBrokersFromPorts(ports: string): string[] {
  const brokers = ports.split(',').map((port) => `localhost:${port}`);
  return brokers;
}

export enum KafkaTopics {
  TEST = 'test',
  RUST_CONSUMER = 'rust-consumer',
}
