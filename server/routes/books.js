var express = require('express');
var router = express.Router();
var pg = require("pg");
var connectionString = 'postgres://localhost:5432/omicron';
router.post("/", function(req, res) {
    var book = req.body;
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
        }
        client.query("INSERT INTO books (author, title, published, genre)" //DB Fields
            +
            "VALUES ($1, $2, $3, $4)", //$1 associated with that position in the array that follows
            [book.author, book.title, book.published, book.genre], //object
            function(err, result) {
                done();
                if (err) {
                    res.sendStatus(500);
                }
                res.sendStatus(201);
            });
    });
});

router.get("/", function(req, res) {
    //Retrieve Books from DB
    pg.connect(connectionString, function(err, client, done) { //(Where am I going, What do i do there)
        if (err) {
            res.sendStatus(500);
        }
        client.query("SELECT * FROM books", function(err, result) { //Second parameter contains results, can be called anything
            done(); //closes connection. I only have 10!
            if (err) {
                res.sendStatus(500);
            }
            res.send(result.rows); //We want to rows because the results will have extra object...stuff
        });
    });
});

router.put("/:id", function(req, res) {
    var id = req.params.id;
    var book = req.body;

    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
        }
        client.query('UPDATE books' +
            ' SET title = $1,' +
            ' author = $2,' +
            ' published = $3,' +
            ' genre = $4' +
            ' WHERE id = $5', [book.title, book.author, book.published, book.genre, id],
            function(err, result) {
                done();
                if (err) {
                    console.log('err', err);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            });
    });

});
router.delete("/:id", function(req, res) {
    var id = req.params.id;
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            res.sendStatus(500);
        }
        client.query('DELETE FROM books ' +
            'WHERE id = $1', [id],
            function(err, result) {
                done();
                if (err) {
                    console.log('err DELETE', err);
                    res.sendStatus(500);
                    return;
                }
                res.sendStatus(200);
            });
    });
});

module.exports = router;
