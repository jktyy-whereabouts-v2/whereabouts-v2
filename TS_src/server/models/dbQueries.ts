const db = require('./whereaboutsModel');

/* START Implement SSE server-side to regularly stream trips data back to FE */
const dbQuery = async (phoneNumber:string) => {
	const { rows } = await db.query(`
    SELECT t.start_timestamp, t.start_lat, t.start_lng, t.sos_timestamp, t.sos_lat, t.sos_lng, t.end_timestamp,j.trips_id, jt.user_phone_number AS traveler_phone_number, u.name AS traveler_name
    FROM trips t
    INNER JOIN trips_users_join j ON t.id = j.trips_id
    INNER JOIN trips_users_join jt ON t.id = jt.trips_id
    INNER JOIN users u ON jt.user_phone_number = u.phone_number
    WHERE j.user_phone_number = '${phoneNumber}'
    AND j.user_is_traveler = FALSE
    AND jt.user_is_traveler = TRUE
    ORDER BY t.end_timestamp DESC, t.sos_timestamp ASC, j.trips_id DESC
  `);
	// console.log(rows);
	// const trips = [];
	// rows.map(row => trips.push(row.trips_id));
	// const {rows : travelers } = await db.query(`
	//   SELECT j.trips_id, u.name as traveler, u.phone_number as traveler_phone_number
	//   FROM trips_users_join j
	//   INNER JOIN users u ON u.phone_number = j.user_phone_number
	//   WHERE j.trips_id IN (${trips})
	//   AND j.user_is_traveler = TRUE
	// `);
	// console.log(travelers);

	return rows;
};

module.exports = dbQuery;