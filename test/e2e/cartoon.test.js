const assert = require('chai').assert;
const mongoose = require('mongoose');
const request = require('./request');

describe('Cartoons API', ()=>{

    beforeEach(()=> mongoose.connection.dropDatabase());

    const rugRats = {
        name: 'Rugrats',
        releaseYear: 1991
    };

    it('Saves a cartoon with id', ()=>{

        return request.post('/api/cartoons')
            .send(rugRats)
            .then(res => {
                const cartoon = res.body;
                assert.ok(cartoon._id);
                assert.equal(cartoon.name, rugRats.name);
            });

    });
    
    it('Shoud get a cartoon by id', ()=>{
        let cartoon;
        let id;

        return request.post('/api/cartoons')
            .send(rugRats)
            .then(res => {
                cartoon = res.body;
                id = cartoon._id;
            })
            .then(()=>{
                return request.get(`/api/cartoons/${id}`)
                    .then(res =>{
                        assert.deepEqual(res.body, cartoon);
                    });
            });

    });

    it('get by id returns 404 for bad id', () => {
        return request.get('/api/cartoons/59dfeaeb083bf9beecc97ce8')
            .then(
                () => { throw new Error('Unexpected successful response'); },
                err => {
                    assert.equal(err.status, 404);    
                }
            );
    });

    it('gets all cartoons', () => {
        const rugRats = {
            name: 'Rugrats',
            releaseYear: 1991
        };

        const pokemon = {
            name: 'Pokemon',
            releaseYear: 1997
        };

        const posts = [rugRats, pokemon].map(cartoon => {
            return request.post('/api/cartoons')
                .send(cartoon)
                .then(res => res.body);
        });

        let saved = null;
        return Promise.all(posts)
            .then(_saved => {
                saved = _saved;
                return request.get('/api/cartoons');
            })
            .then(res => {
                assert.deepEqual(res.body, saved);
            });
    });

    it('delete by id', () => {
        let cartoon = null;
        return request.post('/api/cartoons')
            .send(rugRats)
            .then(res => {
                cartoon = res.body;
                return request.delete(`/api/cartoons/${cartoon._id}`);
            })
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
                return request.get(`/api/cartoons/${cartoon._id}`);                
            })
            .then(
                () => { throw new Error('Unexpected successful response'); },
                err => {
                    assert.equal(err.status, 404);    
                }
            );
    });

});