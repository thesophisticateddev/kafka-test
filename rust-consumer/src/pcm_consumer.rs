use kafka::{
    client::GroupOffsetStorage,
    consumer::{Consumer, Message},
};

use crate::model::{
    pcm_model::{PCMDocument, PCMModel},
    repository_trait::Repository,
};

pub struct PCMConsumer {
    hosts: Vec<String>,
    consumer: Consumer,
    group_name: String,
    topic: String,
    repo: PCMModel,
}

pub trait ConsumerBehavior {
    fn consume(&mut self);
    fn get_event_data(m: &Message) -> serde_json::Value;
    fn run_detections(&mut self, data: serde_json::Value);
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
            repo: PCMModel::new(
                "mongodb://root:example@localhost:27017/".to_owned(),
                "nest".to_owned(),
            ),
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

    fn run_detections(&mut self, data: serde_json::Value) {
        let list_json = data["text"].as_array();
        if list_json.is_none() {
            error!("Text is empty");
            return;
        }

        //Detect emails
        let email_regex =
            regex::Regex::new(r"([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})").unwrap();
        let text_list = list_json.unwrap();
        let mut emails: Vec<String> = Vec::new();
        let phone_regex = regex::Regex::new(r"(\d{3}-\d{3}-\d{4})").unwrap();
        let mut phones: Vec<String> = Vec::new();

        //Detect Ip addresses
        let ip_regex = regex::Regex::new(r"(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})").unwrap();
        let mut ips: Vec<String> = Vec::new();
        for t in text_list {
            let text = t.as_str().unwrap();
            println!("Text: {}", text);
            if text.is_empty() {
                continue;
            }
            //Detect emails

            for email_captures in email_regex.captures_iter(text) {
                let extracts: (&str, [&str; 1]) = email_captures.extract();
                println!("Email detected: {}", extracts.0.to_string());
                emails.push(extracts.0.to_string());
            }

            //Detect phone numbers
            for phone_captures in phone_regex.captures_iter(text) {
                let extracts: (&str, [&str; 1]) = phone_captures.extract();
                println!("Phone detected: {}", extracts.0.to_string());
                phones.push(extracts.0.to_string());
            }

            //Detect Ip addresses
            for ip_captures in ip_regex.captures_iter(text) {
                let extracts: (&str, [&str; 1]) = ip_captures.extract();
                println!("Ip detected: {}", extracts.0.to_string());
                ips.push(extracts.0.to_string());
            }
        }

        let job_name = data["name"].as_str().unwrap();
        let pcm_doc: PCMDocument = PCMDocument::new(
            data["_id"].as_str().unwrap().to_string(),
            job_name.to_string(),
            "DONE".to_string(),
            phones,
            emails,
            ips,
        );

        let insert_result = self.repo.insert(pcm_doc);
        match insert_result {
            Ok(_) => {
                info!("Inserted document");
            }
            Err(e) => error!("Error inserting document: {:?}", e),
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
                    // println!("Raw data: {:?}", m);
                    let json_data = PCMConsumer::get_event_data(&m);
                    println!("Json data {:?}", json_data);
                    let job_id = json_data["_id"].as_str();
                    if job_id.is_none() {
                        error!("Job id is empty");
                        continue;
                    }

                    println!("Job id {} started processing", job_id.unwrap().to_string());
                    self.run_detections(json_data);
                }
                let msg_consumed = self.consumer.consume_messageset(ms);
                match msg_consumed {
                    Ok(_) => {
                        info!("Consumed message");
                    }
                    Err(e) => error!("Error consuming message: {:?}", e),
                }
            }
            self.consumer.commit_consumed().unwrap();
        }
    }
}
