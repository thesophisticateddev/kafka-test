pub trait Repository<T> {
    fn get_by_id(&self, id: String) -> Result<Option<T>, mongodb::error::Error>;
    fn get_page(&self, page: i64, limit: i64) -> Result<Vec<T>, mongodb::error::Error>;
    fn insert(&self, doc: T) -> Result<(), mongodb::error::Error>;
}

pub trait DocumentMapper<T> {
    fn map_to_document(cursor: mongodb::sync::Cursor<T>) -> Vec<T>;
}
