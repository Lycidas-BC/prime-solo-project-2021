const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");

/**
 * GET media collection
 */
router.get("/", rejectUnauthenticated, (req, res) => {
  // GET route code here
  console.log("in GET collection");
  const orderBy =
    req.query.orderBy || req.query.orderBy === ""
      ? req.query.orderBy
      : '"media"."id"';

  const queryText = `
    SELECT "media"."id", "media"."item", "media"."distributor", "media"."product_page", "media"."format", "media"."cover_art", "media"."description", "media"."dimensions", "media"."shelf"
    FROM "media"
    JOIN "user_media" ON "media"."id" = "user_media"."media_id"
    WHERE "user_media"."user_id" = $1
    ORDER BY ${orderBy};
  `;
  pool
    .query(queryText, [req.user.id])
    .then((response) => {
      if (response.rows.length === 0) {
        res.send([
          {
            columnHeaders: response.fields.map((element) => {
              return element.name;
            }),
          },
        ]);
      } else {
        res.send(response.rows);
      }
    })
    .catch((err) => {
      console.log("GET media collection failed: ", err);
      res.sendStatus(500);
    });
});

/**
 * GET specific media item
 */
router.get("/:mediaId", rejectUnauthenticated, (req, res) => {
  // GET route code here
  console.log("in GET media item", req.params.mediaId);

  const queryText = `
    SELECT "media"."id", "media"."item", "media"."distributor", "media"."product_page", "media"."format", "media"."cover_art", "media"."description", "media"."dimensions", "media"."shelf"
    FROM "media"
    JOIN "user_media" ON "media"."id" = "user_media"."media_id"
    WHERE "media"."id" = $1;
  `;
  pool
    .query(queryText, [req.params.mediaId])
    .then((response) => {
      if (response.rows.length === 0) {
        res.send([
          {
            columnHeaders: response.fields.map((element) => {
              return element.name;
            }),
          },
        ]);
      } else {
        res.send(response.rows);
      }
    })
    .catch((err) => {
      console.log("GET media item failed: ", err);
      res.sendStatus(500);
    });
});

/**
 * is any movie from the list in user media collection?
 */
router.get("/searchCollection/:tmdbId", rejectUnauthenticated, (req, res) => {
  // GET route code here
  console.log("search collection for movie");
  const tmdbIdList = decodeURIComponent(req.params.tmdbId).split(",");
  let queryText = `
    SELECT "media"."id" AS "media_id", array_agg("media_movie"."id") AS "media_movie_id", "media"."item", "media"."distributor", "media"."product_page", "media"."format", "media"."cover_art", "media"."description", "media"."dimensions", "media"."shelf", array_agg("movie"."tmdb_id") AS tmdb_id_list
    FROM "media_movie"
    JOIN "movie" ON "movie"."id" = "media_movie"."movie_id"
    JOIN "media" ON "media"."id" = "media_movie"."media_id"
    JOIN "user_media" ON "media"."id" = "user_media"."media_id"
    WHERE "user_media"."user_id" = $1 AND
    (
  `;
  for (const index in tmdbIdList) {
    queryText += `"movie"."tmdb_id" = $${Number(index) + 2}`;
    if (Number(index) + 1 < tmdbIdList.length) {
      queryText += ` OR
      `;
    }
  }
  queryText += `)
  GROUP BY "media"."id";`;
  const queryParams = [req.user.id].concat(tmdbIdList);
  pool
    .query(queryText, queryParams)
    .then((response) => {
      if (response.rows.length === 0) {
        res.send([
          {
            columnHeaders: response.fields.map((element) => {
              return element.name;
            }),
          },
        ]);
      } else {
        res.send(response.rows);
      }
    })
    .catch((err) => {
      console.log("search collection for movie failed: ", err);
      res.sendStatus(500);
    });
});

/**
 * GET framegrabs associated with movie
 */
router.get("/framegrabs/:tmdb_id", rejectUnauthenticated, (req, res) => {
  // GET route code here
  console.log("in GET media item", req.params.tmdb_id);

  const queryText = `
    SELECT "media_movie"."id" AS "media_movie_id", "media_movie"."media_id" AS "media_id", "movie"."name", "movie"."content_type", "movie"."tmdb_id", array_agg("framegrab"."path" || ' ' || "framegrab"."timestamp_seconds") AS "framegrab_list", "media_movie"."cover_art" AS "media_movie_cover_art", "media_movie"."length", "media_movie"."description", "media"."item", "media"."distributor", "media"."product_page", "media"."format", "media"."cover_art" AS "media_cover_art", "media"."description", "media"."dimensions", "media"."shelf"
    FROM "media_movie_framegrab"
    FULL JOIN "media_movie" ON "media_movie"."id" = "media_movie_framegrab"."media_movie_id"
    FULL JOIN "framegrab" ON "framegrab"."id" = "media_movie_framegrab"."framegrab_id"
    JOIN "movie" ON "movie"."id" = "media_movie"."movie_id"
    JOIN "media" ON "media"."id" = "media_movie"."media_id"
    WHERE "movie"."tmdb_id" = $1
    GROUP BY "media_movie"."id", "movie"."name", "movie"."content_type", "movie"."tmdb_id", "media_movie"."cover_art", "media_movie"."length", "media_movie"."description", "media_movie"."media_id", "media"."item", "media"."distributor", "media"."product_page", "media"."format", "media"."cover_art", "media"."description", "media"."dimensions", "media"."shelf";
  `;
  pool
    .query(queryText, [req.params.tmdb_id])
    .then((response) => {
      if (response.rows.length === 0) {
        res.status(201).send("empty");
      } else {
        res.send(response.rows);
      }
    })
    .catch((err) => {
      console.log("GET media item failed: ", err);
      res.sendStatus(500);
    });
});

/**
 * GET media item details
 */
router.get("/media_movies/:mediaId", rejectUnauthenticated, (req, res) => {
  // GET route code here
  console.log("in GET media_movies");
  const mediaId = req.params.mediaId;

  const queryText = `
    SELECT "movie"."id" AS "movie_id", "movie"."name", "movie"."tmdb_id", "media_movie"."description", "media_movie"."length", "media_movie"."cover_art", "movie"."content_type" as "media_type", "media_movie"."product_url"
    FROM "media_movie"
    JOIN "movie" ON "movie"."id" = "media_movie"."movie_id"
    WHERE "media_movie"."media_id" = $1;
  `;
  pool
    .query(queryText, [mediaId])
    .then((response) => {
      if (response.rows.length === 0) {
        res.send([
          {
            columnHeaders: response.fields.map((element) => {
              return element.name;
            }),
          },
        ]);
      } else {
        res.send(response.rows);
      }
    })
    .catch((err) => {
      console.log("GET media_movies failed: ", err);
      res.sendStatus(500);
    });
});

/**
 * GET media item details
 */
router.get(
  "/media_specialfeatures/:mediaId",
  rejectUnauthenticated,
  (req, res) => {
    // GET route code here
    console.log("in GET media_specialfeatures");
    const mediaId = req.params.mediaId;

    const queryText = `
    SELECT "specialfeature"."description"
    FROM "specialfeature"
    JOIN "media_specialfeature" ON "specialfeature"."id" = "media_specialfeature"."specialfeature_id"
    WHERE "media_specialfeature"."media_id" = $1;
  `;
    pool
      .query(queryText, [mediaId])
      .then((response) => {
        if (response.rows.length === 0) {
          res.send([
            {
              columnHeaders: response.fields.map((element) => {
                return element.name;
              }),
            },
          ]);
        } else {
          res.send(response.rows);
        }
      })
      .catch((err) => {
        console.log("GET media_specialfeatures failed: ", err);
        res.sendStatus(500);
      });
  }
);

/**
 * GET media item details
 */
router.get("/media_movie_notes/:mediaId", rejectUnauthenticated, (req, res) => {
  // GET route code here
  console.log("in GET media_movie_notes");
  const mediaId = req.params.mediaId;

  const queryText = `
    SELECT "media_movie_note"."media_movie_id" ,"media_movie_note"."seen", "note"."note", "note"."date", "access"."type"
    FROM "media_movie_note"
    JOIN "note" ON "note"."id" = "media_movie_note"."note_id"
    JOIN "access" ON "access"."id" = "note"."access_id"
    WHERE "media_movie_note"."media_movie_id" = $1 AND "note"."user_id" = $2;
  `;
  pool
    .query(queryText, [mediaId, req.user.id])
    .then((response) => {
      console.log(response.data);
      if (response.rows.length === 0) {
        res.send([
          {
            columnHeaders: response.fields.map((element) => {
              return element.name;
            }),
          },
        ]);
      } else {
        res.send(response.data);
      }
    })
    .catch((err) => {
      console.log("GET media_movie_notes failed: ", err);
      res.sendStatus(500);
    });
});

/**
 * POST new item to media collection
 */
router.post("/media", rejectUnauthenticated, (req, res) => {
  console.log("POST new item to media collection");
  // add media into media table, returning the id of the newly created item
  const mediaInsertQuery = `
    INSERT INTO "media" ("item", "distributor", "format", "cover_art", "description", "dimensions", "shelf", "product_page")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING "id" AS "media_id";
  `;
  pool
    .query(mediaInsertQuery, [
      req.body.item,
      req.body.distributor,
      req.body.format,
      req.body.cover_art,
      req.body.description,
      req.body.dimensions,
      req.body.shelf,
      req.body.product_url,
    ])
    .then((response) => {
      // update the user_media join table with the user id and newly-created media id
      const newMediaId = response.rows[0].media_id;
      const userMediaInsertQuery = `
      INSERT INTO "user_media" ("user_id", "media_id")
      VALUES ($1, $2);
    `;
      pool
        .query(userMediaInsertQuery, [req.user.id, newMediaId])
        .then(() => {
          res.status(201).send({ newMediaId: newMediaId });
        })
        .catch((err) => {
          console.log(
            "POST to media succeeded, but insert to user_media failed: ",
            err
          );
          res.sendStatus(500);
        });
    })
    .catch((err) => {
      console.log("POST to media failed: ", err);
      res.sendStatus(500);
    });
});

/**
 * POST media movies
 */
router.post("/movie/:mediaId", rejectUnauthenticated, (req, res) => {
  const mediaId = req.params.mediaId;
  const newMovieList = req.body.movieList;
  let counter = 0;
  for (const newMovie of newMovieList) {
    const tmdbId = Array.isArray(newMovie.tmdb_id)
      ? newMovie.tmdb_id[0]
      : Number.isInteger(newMovie.tmdb_id)
      ? newMovie.tmdb_id
      : null;
    const movieInsertIfNotExistQuery = `
      INSERT INTO "movie" ("name", "tmdb_id", "content_type")
      VALUES ($1, $2, $3)
      ON CONFLICT ("tmdb_id") WHERE NOT NULL
      DO NOTHING;
    `;

    pool
      .query(movieInsertIfNotExistQuery, [
        newMovie.movie,
        tmdbId,
        newMovie.media_type,
      ])
      .then(() => {
        let getMovieIdQuery = "";
        if (tmdbId != null) {
          getMovieIdQuery = `
            SELECT "id"
            FROM "movie"
            WHERE "tmdb_id" = $1;
          `;
        } else {
          getMovieIdQuery = `
            SELECT "id"
            FROM "movie"
            WHERE "tmdb_id" IS NULL AND "name" = $1;
          `;
        }
        pool
          .query(getMovieIdQuery, [tmdbId ? tmdbId : newMovie.movie])
          .then((response) => {
            const movieId = response.rows[0].id;
            const mediaMovieInsertQuery = `
              INSERT INTO "media_movie" ("movie_id", "media_id", "cover_art", "length", "description", "product_url")
              VALUES($1, $2, $3, $4, $5, $6);
            `;
            pool
              .query(mediaMovieInsertQuery, [
                movieId,
                mediaId,
                newMovie.cover_art,
                newMovie.length,
                newMovie.description,
                newMovie.product_url,
              ])
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
            console.log("failed to get movie id from movie table", err);
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
router.post("/specialfeature/:mediaId", rejectUnauthenticated, (req, res) => {
  const mediaId = req.params.mediaId;
  const featuresList = req.body.featuresList;
  let counter = 0;
  for (const newSpecialFeature of featuresList) {
    const specialFeatureInsertQuery = `
     INSERT INTO "specialfeature" ("description")
     VALUES ($1)
     RETURNING "id";
   `;

    pool
      .query(specialFeatureInsertQuery, [newSpecialFeature])
      .then((response) => {
        const specialFeatureId = response.rows[0].id;
        const mediaMovieInsertQuery = `
         INSERT INTO "media_specialfeature" ("media_id", "specialfeature_id")
         VALUES($1, $2);
       `;
        pool
          .query(mediaMovieInsertQuery, [mediaId, specialFeatureId])
          .then((response) => {
            counter++;
            if (counter === featuresList.length) {
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
router.put("/:mediaId", (req, res) => {
  // PUT route code here
});

/**
 * DELETE item from collection - this will remove art and notes associated with item
 */
router.delete("/:mediaId", rejectUnauthenticated, (req, res) => {
  // DELETE route code here
  console.log("in delete route", req.user.id, req.params.mediaId);
  const userMediaDeleteQuery = `
    DELETE FROM "user_media"
    WHERE "user_id" = $1 AND "media_id" = $2;
  `;
  pool
    .query(userMediaDeleteQuery, [req.user.id, req.params.mediaId])
    .then((response) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log("DELETE failed", err);
      res.sendStatus(500);
    });
});

/**
 * POST framegrab to database
 */
router.post("/framegrab/:movie_media_id", rejectUnauthenticated, (req, res) => {
  console.log(
    "/framegrab/:movie_media_id",
    req.body,
    req.params.movie_media_id
  );

  // add media into media table, returning the id of the newly created item
  const framegrabInsertQuery = `
    INSERT INTO "framegrab" ("path", "timestamp_seconds")
    VALUES ($1, $2)
    RETURNING "id" AS "framegrab_id";
  `;
  pool
    .query(framegrabInsertQuery, [req.body.path, req.body.timestamp])
    .then((response) => {
      // update the user_media join table with the user id and newly-created media id
      const newFramegrabId = response.rows[0].framegrab_id;
      const mediaMovieFramegrabInsertQuery = `
      INSERT INTO "media_movie_framegrab" ("media_movie_id", "framegrab_id")
      VALUES ($1, $2);
    `;
      pool
        .query(mediaMovieFramegrabInsertQuery, [
          req.params.movie_media_id,
          newFramegrabId,
        ])
        .then(() => {
          res.sendStatus(201);
        })
        .catch((err) => {
          console.log(
            "POST framegrab succeeded, but insert to media_movie_framegrab failed: ",
            err
          );
          res.sendStatus(500);
        });
    })
    .catch((err) => {
      console.log("POST framegrab failed: ", err);
      res.sendStatus(500);
    });
});

module.exports = router;
