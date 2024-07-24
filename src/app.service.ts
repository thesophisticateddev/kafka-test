import { Injectable } from '@nestjs/common';
import { KafkaService } from './kafka/kafka.service';

@Injectable()
export class AppService {
  constructor(private readonly kafkaService: KafkaService) {}
  getHello(): string {
    this.kafkaService.sendMessage('test', 'Hello Kafka!');

    this.kafkaService.sendMessage(
      'rust-consumer',
      JSON.stringify({ name: 'John Doe', age: 25 }),
    );
    return 'Hello World!';
  }

  receiveMessage(): string {
    this.kafkaService.receiveMessage('test');
    return 'Received message!';
  }
}
