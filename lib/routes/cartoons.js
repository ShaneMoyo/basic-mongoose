const Router = require('express').Router;
const router = Router();
const Cartoon = require('../model/cartoon');

router
    .post('/', (req, res)=>{
        new Cartoon(req.body).save()
            .then(cartoon => res.json(cartoon))
            .catch(err => {
                res.statusCode = 400;
                res.json({
                    errors: err.errors
                });
            });
    });


module.exports = router; 

