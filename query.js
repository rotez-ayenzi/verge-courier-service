const queries = {
    signUpUserQuery: `
    INSERT INTO users(
        first_name,
        last_name,
        email,
        password,
        state,
        created_at,
        updated_at,
        admin_type
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    signInUserQuery: `
        SELECT * FROM users WHERE email=($1)`,
    parcelOrderQuery: `
        INSERT INTO parcel(
            sender_name,
            price,
            weight,
            location,
            destination,
            sender_note,
            created_at,
            updated_at,
            user_id,
            status
    ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    getUserOrderByUser: `
    SELECT * FROM parcel WHERE user_id=($1)`,
    getUserOrderById: `
    SELECT * FROM parcel WHERE id=($1) AND user_id=($2)`,
    getAllParcelOrder: `
    SELECT * FROM parcel`,
    updateDestinationById: `
    UPDATE parcel SET destination=($1), updated_at = ($2) WHERE id =($3) AND user_id=($4) RETURNING *`,
    updateTypeByAdmin: `
    UPDATE users SET admin_type=($1) WHERE id=($2)`,
    updateTypeByAdmin:`
    UPDATE users SET admin_type=($1),updated_at=($2) WHERE id=($3)`,
    deleteParcelByUserId: `
    DELETE FROM parcel WHERE id = ($1)`,
    selectUserById: `
    SELECT * FROM users WHERE id=($1)`,
    updateLocationByAdmin: `
    UPDATE parcel SET location=($1), updated_at =($2) WHERE id =($3)`,
    updateStatus: `
    UPDATE parcel SET status=($1), updated_at = ($2) WHERE id = ($3) RETURNING *`,
    getStatus:`
    SELECT * FROM parcel WHERE id=($1)`

}
module.exports = queries