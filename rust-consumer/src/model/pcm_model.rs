use mongodb::{bson::doc, options::FindOptions, sync::Collection};
use serde::{Deserialize, Serialize};

use super::repository_trait::{DocumentMapper, Repository};

const PCM_COLLECTION: &str = "pcm";

#[derive(Debug, Serialize, Deserialize)]
pub struct PCMDocument {
    id: String,
    job_name: String,
    job_execution_status: String,
    phone_numbers: Vec<String>,
    email_addresses: Vec<String>,
    ip_addresses: Vec<String>,
}

impl PCMDocument {
    pub fn new(
        id: String,
        job_name: String,
        job_execution_status: String,
        phone_numbers: Vec<String>,
        email_addresses: Vec<String>,
        ip_addresses: Vec<String>,
    ) -> PCMDocument {
        PCMDocument {
            id,
            job_name,
            job_execution_status,
            phone_numbers,
            email_addresses,
            ip_addresses,
        }
    }
}

pub struct PCMModel {
    collection: Collection<PCMDocument>,
}

impl PCMModel {
    pub fn new(conn_str: String, db_name: String) -> PCMModel {
        let client = mongodb::sync::Client::with_uri_str(&conn_str).unwrap();
        let collection = client
            .database(db_name.as_str())
            .collection::<PCMDocument>(PCM_COLLECTION)
            .clone_with_type();
        PCMModel { collection }
    }
}

impl DocumentMapper<PCMDocument> for PCMModel {
    fn map_to_document(mut cursor: mongodb::sync::Cursor<PCMDocument>) -> Vec<PCMDocument> {
        let mut results: Vec<PCMDocument> = Vec::new();
        while let Some(doc) = cursor.next() {
            match doc {
                Ok(d) => results.push(d),
                Err(err) => {
                    eprintln!("Error occured while fetching results {:?}", err);
                }
            }
        }
        return results;
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
                let results = PCMModel::map_to_document(cursor);
                Ok(results)
            }
            Err(err) => {
                eprintln!("Error occured while fetching results {:?}", err);
                return Err(err);
            }
        }
    }

    fn insert(&self, doc: PCMDocument) -> Result<(), mongodb::error::Error> {
        return match self.collection.insert_one(doc, None) {
            Ok(_) => Ok(()),
            Err(err) => {
                eprintln!("Error occured while inserting document {:?}", err);
                Err(err)
            }
        };
    }
}
