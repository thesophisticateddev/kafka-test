import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Partitioners, Producer } from 'kafkajs';
import { EnvConstants, getBrokersFromPorts } from 'src/utils/config';

@Injectable()
export class KafkaService {
  private kafkaClient: Kafka;
  private static logger = new Logger(KafkaService.name);
  private producer: Producer;
  constructor(private readonly config: ConfigService) {
    this.kafkaClient = new Kafka({
      clientId: config.get<string>(EnvConstants.MESSAGE_QUEUE_CLIENT_ID),
      brokers: getBrokersFromPorts(
        config.get<string>('KAFKA_HOST'),
        config.get<string>(EnvConstants.MESSAGE_QUEUE_PORTS),
      ),
    });
    // console.log('KafkaService initialized');
    KafkaService.logger.log('KafkaService initialized');
    this.producer = this.kafkaClient.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });

    this.producer.connect();
  }

  public sendMessage(topic: string, message: string): void {
    // this.producer.connect().then(() => {

    // });
    KafkaService.logger.log('Message Sent to queue');
    this.producer.send({
      topic,
      messages: [{ value: message }],
    });
  }
}
