import { Injectable } from '@nestjs/common';
import { KafkaService } from './kafka/kafka.service';
import { KafkaTopics } from './utils/config';

@Injectable()
export class AppService {
  constructor(private readonly kafkaService: KafkaService) {}
  getHello(): string {
    this.kafkaService.sendMessage(KafkaTopics.TEST, 'Hello Kafka!');

    this.kafkaService.sendMessage(
      KafkaTopics.RUST_CONSUMER,
      JSON.stringify({ name: 'John Doe', age: 25 }),
    );
    return 'Hello World!';
  }
}
