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
router.post('/', (req, res) => {
  // add media into media table, returning the id of the newly created item
  const mediaInsertQuery = `
    INSERT INTO "media" ("item", "distributor", "format", "cover_art", "description", "dimensions", "shelf")
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING "id" AS "media_id";
  `;
pool
  .query(mediaInsertQuery, [req.body.item, req.body.distributor, req.body.format, req.body.cover_art, req.body.description, req.body.dimensions, req.body.shelf])
  .then((response) => {
    // update the user_media join table with the user id and newly-created media id
    const createdMediaId = response.rows[0].id;
    const userMediaInsertQuery = `
      INSERT INTO "user_media" ("user_id", "media_id")
      VALUES ($1, $2);
    `;
  pool
    .query(userMediaInsertQuery, [req.user.id, createdMediaId])
    .then((response) => {
      if (req.user.movieList && req.user.movieList.length > 0) {
        let tmdbIdListString = "";
        let addMovieIfNotExistAndGetBackIds = "";
        const tmdbIdList = [];
        const insertValues = []; 
        for (const i in req.user.movieList) {
          tmdbIdList.push(req.user.movieList[i].tmdbId);
          tmdbIdListString += `$${i + (6 * req.user.movieList.length) + 1}`;
          insertValues.push(req.user.movieList[i].name, req.user.movieList[i].tmdb_id, req.user.movieList[i].letterboxd_url, req.user.movieList[i].imdb_url, req.user.movieList[i].rottentomatoes_url, req.user.movieList[i].amazon_url);
          addMovieIfNotExistAndGetBackIds = `
          INSERT INTO "movie" ("name", "tmdb_id", "letterboxd_url", "imdb_url", "rottentomatoes_url", "amazon_url")
          VALUES($${6*i+1}, $${6*i+2}, $${6*i+3}, $${6*i+4}, $${6*i+5}, $${6*i+6}) 
          ON CONFLICT ON CONSTRAINT customers_name_key 
          DO NOTHING;
          `;
        }
        // get rid of final ','
        tmdbIdListString = tmdbIdListString.slice(0, -1);
        insertValues = insertValues.concat(tmdbIdList);
        addMovieIfNotExistAndGetBackIds += `
          SELECT "id" FROM "movie"
          WHERE "tmdb_id" IN (${tmdbIdListString});
        `;

        pool
          .query(addMovieIfNotExistAndGetBackIds, [insertValues])
          .then((response) => {
            let movieIdList = response.data;
            // createdMediaId
            let mediaMovieInsertQuery = `
              INSERT INTO "media_movie" ("movie_id", "media_id", "cover_art", "length")
              VALUES
            `;
            for (const movie of movieIdList) {
              mediaMovieInsertQuery += `
                INSERT INTO "media_movie" ("movie_id", "media_id", "cover_art", "length")
                VALUES
              `;
            }

          })
          .catch((err) => {
            console.log('POST to media succeeded, but insert to user_media failed: ', err);
            res.sendStatus(500);
          });
      } else {
        res.sendStatus(201);
      }
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
