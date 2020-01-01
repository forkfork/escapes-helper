SELECT
  DISTINCT schedule.fk_offer_salesforce_id
FROM
  schedule
INNER JOIN offer ON 
  schedule.fk_offer_salesforce_id = offer.id_salesforce_external
INNER JOIN PACKAGE ON 
  schedule.fk_offer_salesforce_id = package.fk_offer_salesforce_id
WHERE 
  brand = 'luxuryescapes'
  AND region IN ('world', 'AU')
  AND START < now()
  AND now() < "end"
  AND schedule.type = 'availability'
  AND offer.status = 'content-approved'
  AND package.status = 'content-approved';
