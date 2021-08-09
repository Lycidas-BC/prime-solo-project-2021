const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

/**
 * GET media collection
 */
router.get('/', rejectUnauthenticated, (req, res) => {
  // GET route code here
  const orderBy = req.query.orderBy || req.query.orderBy === "" ? `"media"."${req.query.orderBy}"` : '"media"."id"';

  const queryText = `
    SELECT "media"."id", "media"."item", "media"."distributor", "media"."format", "media"."cover_art", "media"."description", "media"."dimensions", "media"."shelf"
    FROM "media"
    JOIN "user_media" ON "media"."id" = "user_media"."media_id"
    WHERE "user_media"."user_id" = $1
    ORDER BY $2;
  `;

  pool
    .query(queryText, [req.user.id, orderBy])
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.log('GET media collection failed: ', err);
      res.sendStatus(500);
    });
});

/**
 * POST new item to media collection
 */
router.post('/media', (req, res) => {
  // add media into media table, returning the id of the newly created item
  const mediaInsertQuery = `
    INSERT INTO "media" ("item", "distributor", "format", "cover_art", "description", "dimensions", "shelf")
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING "id" AS "media_id";
  `;
pool
  .query(mediaInsertQuery, [req.body.item, req.body.distributor, req.body.format, req.body.cover_art, req.body.description, req.body.dimensions, req.body.shelf])
  .then((response1) => {
    // update the user_media join table with the user id and newly-created media id
    const newMediaId = response1.rows[0].id;
    const userMediaInsertQuery = `
      INSERT INTO "user_media" ("user_id", "media_id")
      VALUES ($1, $2);
    `;
  pool
    .query(userMediaInsertQuery, [req.user.id, newMediaId])
    .then(() => {
      req.status(201).send({newMediaId: newMediaId});
    })
    .catch((err) => {
      console.log('POST to media succeeded, but insert to user_media failed: ', err);
      res.sendStatus(500);
    });
  })
  .catch((err) => {
    console.log('POST to media failed: ', err);
    res.sendStatus(500);
  });
});

/**
 * POST media movies
 */
 router.post('/movie/:mediaId', (req, res) => {
   const mediaId = req.params.mediaId;
   const newMovieList = req.body.movieList;
   let counter = 0;
   for (const newMovie of newMovieList) {
    const movieInsertIfNotExistQuery = `
      INSERT INTO "movie" ("name", "tmdb_id", "letterboxd_url", "imdb_url", "rottentomatoes_url", "amazon_url")
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT ("tmdb_id")
      DO NOTHING;

      SELECT "id"
      FROM "movie"
      WHERE "tmdb_id" = $2;
    `;

    pool
      .query(movieInsertIfNotExistQuery, [newMovie.name, newMovie.tmdb_id, newMovie.letterboxd_url, newMovie.imdb_url, newMovie.rottentomatoes_url, newMovie.amazon_url])
      .then((response) => {
        console.log('response.rows', response.rows);
        const movieId = response.rows[0].id;
        const mediaMovieInsertQuery = `
          INSERT INTO "media_movie" ("movie_id", "media_id", "cover_art", "length")
          VALUES($1, $2, $3, $4);
        `;
        pool
          .query(mediaMovieInsertQuery, [movieId, mediaId, newMovie.cover_art, newMovie.length])
          .then((response) => {
            counter++;
            if (counter === newMovieList.length) {
              res.sendStatus(201);
            }
          })
          .catch((err) => {
            console.log("movie_media table insert failed", err);
            res.sendStatus(500);
          });
      })
      .catch((err) => {
        console.log("movie table insert failed", err);
        res.sendStatus(500);
    });
   }
});

/**
 * POST media specialfeatures
 */
 router.post('/specialfeature/:mediaId', (req, res) => {
  const mediaId = req.params.mediaId;
  const specialFeatureList = req.body.specialFeatureList;
  let counter = 0;
  for (const newSpecialFeature of specialFeatureList) {
   const specialFeatureInsertQuery = `
     INSERT INTO "specialfeature" ("name", "type", "description")
     VALUES ($1, $2, $3)
     RETURNING "id";
   `;

   pool
     .query(specialFeatureInsertQuery, [newSpecialFeature.name, newSpecialFeature.type, newSpecialFeature.description])
     .then((response) => {
       console.log('response.rows', response.rows);
       const specialFeatureId = response.rows[0].id;
       const mediaMovieInsertQuery = `
         INSERT INTO "media_specialfeature" ("media_id", "specialfeature_id")
         VALUES($1, $2);
       `;
       pool
         .query(mediaMovieInsertQuery, [mediaId, specialFeatureId])
         .then((response) => {
           counter++;
           if (counter === specialFeatureList.length) {
             res.sendStatus(201);
           }
         })
         .catch((err) => {
           console.log("media_specialfeature table insert failed", err);
           res.sendStatus(500);
         });
     })
     .catch((err) => {
       console.log("specialfeature table insert failed", err);
       res.sendStatus(500);
   });
  }
});

/**
 * PUT to update item in media collection
 */
 router.put('/', (req, res) => {
  // POST route code here
});

/**
 * DELETE item from collection - this will remove art and notes associated with item
 */
 router.delete('/:mediaId', (req, res) => {
  // POST route code here
});

module.exports = router;