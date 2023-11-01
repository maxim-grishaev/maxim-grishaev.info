// use http::{Response, StatusCode};
// use lambda_runtime::{run, service_fn, LambdaEvent};
// use tokio_postgres::{Error, NoTls};

// #[tokio::main]
// async fn main() -> Result<(), Error> {
//     tracing_subscriber::fmt()
//         .with_max_level(tracing::Level::INFO)
//         // disable printing the name of the module in every log line.
//         .with_target(false)
//         // disabling time is handy because CloudWatch will add the ingestion time.
//         .without_time()
//         .init();

//     run(service_fn(handler))
//     .await
// }

// fn handler(evt: event: LambdaEvent<Request>) -> Result<impl IntoResponse, HandlerError> {
//     let (client, connection) = tokio_postgres::connect(
//         "host=<DB_HOST> user=<DB_USER> password=<DB_PASSWORD> dbname=<DB_NAME>",
//         NoTls,
//     )
//     .await?;

//     tokio::spawn(async move {
//         if let Err(e) = connection.await {
//             eprintln!("connection error: {}", e);
//         }
//     });

//     let rows = client
//         .query("SELECT * FROM BLAH", &[])
//         .await
//         .expect("Error querying database");

//     let mut response_body = String::new();

//     for row in &rows {
//         let id: i32 = row.get("id");
//         let name: &str = row.get("name");
//         response_body.push_str(&format!("ID: {}, Name: {}\n", id, name));
//     }

//     Ok(Response::builder()
//         .status(StatusCode::OK)
//         .body(response_body)
//         .expect("Failed to construct response"))

//     // response.map_err(|err| HandlerError::from(format!("{}", err)))
// }

// // pub trait IntoResponse {
// //     fn into_response(self) -> Response<String>;
// // }

// // impl IntoResponse for Response<String> {
// //     fn into_response(self) -> Response<String> {
// //         self
// //     }
// // }

fn main() {}
