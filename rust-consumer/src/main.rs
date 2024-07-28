// use kafka::consumer::{Consumer, GroupOffsetStorage, Message};
use std::env;
extern crate pretty_env_logger;
#[macro_use]
extern crate log;
mod pcm_consumer;
use crate::pcm_consumer::{ConsumerBehavior, PCMConsumer};

fn start_consumer() {
    let host_list = vec!["localhost:29092".to_owned(), "localhost:22181".to_owned()];
    let mut pcm_consumer = PCMConsumer::new(host_list);
    info!(
        "Consumer is started running on thread: {:?}",
        std::thread::current().id()
    );
    pcm_consumer.consume();
}
fn main() {
    env::set_var("RUST_LOG", "trace");
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
