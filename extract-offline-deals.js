'use strict';

function main() {
  // [START bigquery_query]
  // [START bigquery_client_default_credentials]
  // Import the Google Cloud client library using default credentials
  const {BigQuery} = require('@google-cloud/bigquery');
  const bigquery = new BigQuery();
  // [END bigquery_client_default_credentials]
  async function query() {
    // Queries the U.S. given names dataset for the state of Texas.

    const query = `
SELECT
  DISTINCT schedule.fk_offer_salesforce_id
FROM
  \`bigquery-162623\`.offer_service_public.schedule
INNER JOIN \`bigquery-162623\`.offer_service_public.offer ON
  schedule.fk_offer_salesforce_id = offer.id_salesforce_external
INNER JOIN \`bigquery-162623\`.offer_service_public.package ON
  schedule.fk_offer_salesforce_id = package.fk_offer_salesforce_id
WHERE
  brand = 'luxuryescapes'
  AND region IN ('world', 'AU')
  AND START < current_timestamp()
  AND current_timestamp() < schedule.end
  AND schedule.type = 'online_purchase'
  AND offer.status = 'content-approved'
  AND package.status = 'content-approved';
`;

    // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
    const options = {
      query: query,
      // Location must match that of the dataset(s) referenced in the query.
      location: 'US',
    };

    // Run the query as a job
    const [job] = await bigquery.createQueryJob(options);
    console.log(`Job ${job.id} started.`);

    // Wait for the query to finish
    const [rows] = await job.getQueryResults();

    // Print the results
    console.log('Rows:');
		let ids = [];
    rows.forEach(row => ids.push("'" + row.fk_offer_salesforce_id + "'"));
		console.log(ids.join(","));
  }
  // [END bigquery_query]
  query();
}
main(...process.argv.slice(2));
