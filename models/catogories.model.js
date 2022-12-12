const db = require("../db/connection");

exports.selectAllCategories = () => {

    return db.query(`SELECT * FROM categories;`)

    .then(({rows}) =>{
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: 'not found'})
        }
        return rows;
    })
};