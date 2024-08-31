// use kafka::consumer::{Consumer, GroupOffsetStorage, Message};
use std::env;
extern crate pretty_env_logger;
#[macro_use]
extern crate log;
mod image_proc;
mod model;
mod pcm_consumer;
use crate::pcm_consumer::{ConsumerBehavior, PCMConsumer};

fn start_consumer() {
    let kafka_host = env::var("KAFKA_HOST")
        .unwrap_or("localhost".to_owned())
        .to_owned();

    let kafka_port = env::var("KAFKA_PORT")
        .unwrap_or("29092".to_owned())
        .to_owned();

    let kafka_port_2 = env::var("KAFKA_PORT_2")
        .unwrap_or("22181".to_owned())
        .to_owned();
    let kafka_host_1 = format!("{}:{}", kafka_host, kafka_port);
    let kafka_host_2 = format!("{}:{}", kafka_host, kafka_port_2);

    info!("Kafka hosts {} {}", kafka_host_1, kafka_host_2);

    let host_list = vec![kafka_host_1.to_owned(), kafka_host_2.to_owned()];
    let mut pcm_consumer = PCMConsumer::new(host_list);
    info!(
        "Consumer is started running on thread: {:?}",
        std::thread::current().id()
    );
    pcm_consumer.consume();
}
fn main() {
    dotenv::dotenv().ok();
    env::set_var("RUST_LOG", "info");
    env::set_var("RUST_BACKTRACE", "1");
    pretty_env_logger::init();
    info!("Starting main thread!");
    loop {
        let handle = std::thread::spawn(move || start_consumer());

        match handle.join() {
            Ok(_) => {
                warn!("Consumer thread is finished");
            }
            Err(e) => {
                error!("Error in consumer thread: {:?}", e);
            }
        }
        warn!("Restarting consumer thread in 20 seconds");
        std::thread::sleep(std::time::Duration::from_secs(20));
    }
    // start_consumer();
}
