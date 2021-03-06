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
    }) 
    .get('/', (req, res) => {
        Cartoon.find()
            .then(cartoons => res.json(cartoons));
    })
    .get('/:id', (req, res) => {
        Cartoon.findById(req.params.id)
            .then(cartoon => {
                if(!cartoon) {
                    res.statusCode = 404;
                    res.send(`id ${req.params.id} does not exist`);
                }
                else res.json(cartoon);
            });
    })
    .delete('/:id', (req, res) => {
        Cartoon.findByIdAndRemove(req.params.id)
            .then(result => {
                const exists = result != null;
                res.json({ removed: exists });
            });
    })
    .put('/:id', (req, res, next)=>{
        const id = req.params.id;
        if (!id) {
            next({ code: 404, error: `id ${req.params.id} does not exist` });
        } else {
            Cartoon.update({ _id: id }, req.body, function (err, data) {
                res.send(data);
            });
        }
    });


module.exports = router; 

