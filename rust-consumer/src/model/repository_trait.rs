pub trait Repository<T> {
    fn get_by_id(&self, id: String) -> Result<Option<T>, mongodb::error::Error>;
    fn get_page(&self, page: i64, limit: i64) -> Result<Vec<T>, mongodb::error::Error>;
}
