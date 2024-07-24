use kafka::{
    client::GroupOffsetStorage,
    consumer::{Consumer, Message},
};

pub struct PCMConsumer {
    hosts: Vec<String>,
    consumer: Consumer,
    group_name: String,
    topic: String,
}

pub trait ConsumerBehavior {
    fn consume(&mut self);
    fn get_event_data(m: &Message) -> serde_json::Value;
}

impl PCMConsumer {
    pub fn new(host_list: Vec<String>) -> PCMConsumer {
        const TOPIC: &str = "rust-consumer";
        const GROUP_NAME: &str = "test-group";

        let consumer = Consumer::from_hosts(host_list.clone())
            .with_topic(TOPIC.to_owned())
            .with_group(GROUP_NAME.to_owned())
            .with_offset_storage(Some(GroupOffsetStorage::Kafka))
            .create()
            .unwrap();
        PCMConsumer {
            hosts: host_list,
            consumer,
            group_name: GROUP_NAME.to_owned(),
            topic: TOPIC.to_owned(),
        }
    }
}

impl ConsumerBehavior for PCMConsumer {
    fn get_event_data(m: &Message) -> serde_json::Value {
        let event = std::str::from_utf8(m.value).unwrap().to_string();
        match serde_json::from_str(&event) {
            Ok(json_data) => json_data,
            Err(e) => {
                error!("Error parsing json data: {:?}", e);
                serde_json::Value::Null
            }
        }
    }

    fn consume(&mut self) {
        info!(
            "Consumer created for topic {} with group {} started",
            self.topic, self.group_name
        );
        loop {
            for ms in self.consumer.poll().unwrap().iter() {
                for m in ms.messages() {
                    println!("Raw data: {:?}", m);
                    let json_data = PCMConsumer::get_event_data(&m);
                    println!("Json data {:?}", json_data);
                }
                let msg_consumed = self.consumer.consume_messageset(ms);
                match msg_consumed {
                    Ok(_) => info!("Consumed message"),
                    Err(e) => error!("Error consuming message: {:?}", e),
                }
            }
            self.consumer.commit_consumed().unwrap();
        }
    }
}
