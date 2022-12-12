const {selectAllCategories} = require ('../models/catogories.model')

exports.getCategories = (req, res, next) => {
    selectAllCategories()
    .then((categories) =>{
        res.send({categories})
    })
    .catch(next)
};
