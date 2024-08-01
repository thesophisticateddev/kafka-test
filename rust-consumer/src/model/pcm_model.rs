use mongodb::{bson::doc, options::FindOptions, sync::Collection};
use serde::{Deserialize, Serialize};

use super::repository_trait::Repository;

const PCM_COLLECTION: &str = "pcm";

#[derive(Debug, Serialize, Deserialize)]
pub struct PCMDocument {
    id: String,
    job_name: String,
    job_execution_status: String,
}

pub struct PCMModel {
    collection: Collection<PCMDocument>,
    db_name: String,
}

impl PCMModel {
    pub fn new(conn_str: String, db_name: String) -> PCMModel {
        let client = mongodb::sync::Client::with_uri_str(&conn_str).unwrap();
        let collection = client
            .database(db_name.as_str())
            .collection::<PCMDocument>(PCM_COLLECTION)
            .clone_with_type();
        PCMModel {
            collection,
            db_name: db_name.to_owned(),
        }
    }
}

impl Repository<PCMDocument> for PCMModel {
    fn get_by_id(&self, id: String) -> Result<Option<PCMDocument>, mongodb::error::Error> {
        return self.collection.find_one(doc! {"id":id}, None);
    }

    fn get_page(&self, page: i64, limit: i64) -> Result<Vec<PCMDocument>, mongodb::error::Error> {
        let cwn = page * limit;
        let opts: FindOptions = FindOptions::builder()
            .limit(Some(limit))
            .skip(Some(cwn as u64))
            .build();
        let query_result = self.collection.find(None, opts);
        match query_result {
            Ok(mut cursor) => {
                let mut results: Vec<PCMDocument> = Vec::new();
                while let Some(doc) = cursor.next() {
                    match doc {
                        Ok(d) => results.push(d),
                        Err(err) => {
                            return Err(err);
                        }
                    }
                }
                Ok(results)
            }
            Err(err) => {
                eprintln!("Error occured while fetching results {:?}", err);
                return Err(err);
            }
        }
    }
}
