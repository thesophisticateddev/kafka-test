import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Partitioners } from 'kafkajs';
import { EnvConstants, getBrokersFromPorts } from 'src/utils/config';

@Injectable()
export class KafkaService {
  private kafkaClient: Kafka;
  private static logger = new Logger(KafkaService.name);
  constructor(private readonly config: ConfigService) {
    this.kafkaClient = new Kafka({
      clientId: config.get<string>(EnvConstants.MESSAGE_QUEUE_CLIENT_ID),
      brokers: getBrokersFromPorts(
        config.get<string>(EnvConstants.MESSAGE_QUEUE_PORTS),
      ),
    });
    // console.log('KafkaService initialized');
    KafkaService.logger.log('KafkaService initialized');
  }

  public sendMessage(topic: string, message: string): void {
    const producer = this.kafkaClient.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
    producer.connect().then(() => {
      producer.send({
        topic,
        messages: [{ value: message }],
      });
    });
  }

  public async receiveMessage(topic: string): Promise<string> {
    const consumer = this.kafkaClient.consumer({ groupId: 'test-group' });
    await consumer.connect();
    await consumer.subscribe({ topic });
    console.log('Subscribed to topic');
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log('HLLLLLLLL\n\n\n');
        console.log({
          value: message.value.toString(),
          headers: message.headers,
        });
      },
    });
    console.log('Message received');
    return 'Received message!';
  }
}
