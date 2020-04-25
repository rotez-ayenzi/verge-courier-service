const queries={
    signUpUserQuery:`
    INSERT INTO users(
        first_name,
        last_name,
        email,
        password,
        state,
        created_at,
        updated_at,
        is_admin
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        signInUserQuery:`
        SELECT * FROM users WHERE email=($1)`,
        parcelOrderQuery:`
        INSERT INTO parcel(
            sender_name,
            price,
            weight,
            location,
            destination,
            sender_note,
            created_at,
            updated_at,
            user_id
    ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    getUserOrderByUserId:`
    SELECT * FROM parcel WHERE user_id=($1)`,
    getUserOrderById:`
    SELECT * FROM parcel WHERE id=($1)`,
    updateDestinationById:`
    UPDATE parcel SET destination=($1), updated_at = ($2) WHERE id =($3)`,
    deleteParcelByUserId:`
    DELETE FROM parcel WHERE id = ($1)`,
    selectUserById:`
    SELECT * FROM users WHERE id=($1)`,
    updateLocationByAdmin:`
    UPDATE parcel SET location=($1) WHERE id =($2)`
    
}
module.exports = queries