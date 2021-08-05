-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE "user" (
	"id" serial NOT NULL,
	"username" varchar(80) NOT NULL UNIQUE,
	"password" varchar(120) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"image_url" varchar(2000) NOT NULL,
	CONSTRAINT "user_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "media" (
	"id" serial NOT NULL,
	"item" varchar(220) NOT NULL,
	"distributor" varchar(120) NOT NULL,
	"format" varchar(50) NOT NULL,
	"cover_art" varchar(255) NOT NULL,
	"dimensions" varchar(50) NOT NULL,
	"shelf" varchar(50) NOT NULL,
	CONSTRAINT "media_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "movie" (
	"id" serial NOT NULL,
	"name" varchar(220) NOT NULL,
	"tmdb_id" integer NOT NULL,
	"letterboxd_url" varchar(500) NOT NULL,
	"imdb_url" varchar(500) NOT NULL,
	"rottentomatoes_url" varchar(500) NOT NULL,
	"amazon_url" varchar(2000) NOT NULL,
	CONSTRAINT "movie_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "media_movie" (
	"id" serial NOT NULL,
	"movie_id" integer NOT NULL,
	"media_id" integer NOT NULL,
	"length" integer NOT NULL,
	CONSTRAINT "media_movie_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "framegrab" (
	"id" serial NOT NULL,
	"path" varchar(2000) NOT NULL,
	CONSTRAINT "framegrab_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "specialfeature" (
	"id" serial NOT NULL,
	"name" varchar(100) NOT NULL,
	"type" varchar(50) NOT NULL,
	"description" varchar(255) NOT NULL,
	CONSTRAINT "specialfeature_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "media_specialfeature" (
	"id" serial NOT NULL,
	"media_id" serial NOT NULL,
	"specialfeature_id" serial NOT NULL,
	CONSTRAINT "media_specialfeature_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "art" (
	"id" serial NOT NULL,
	"path" varchar(2000) NOT NULL,
	"style" varchar(100) NOT NULL,
	CONSTRAINT "art_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "movie_art" (
	"id" serial NOT NULL,
	"movie_id" integer NOT NULL,
	"art_id" integer NOT NULL,
	CONSTRAINT "movie_art_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "artist" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"country" varchar(100) NOT NULL,
	"picture?" varchar(100) NOT NULL,
	CONSTRAINT "artist_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "tag" (
	"id" serial NOT NULL,
	"tag" varchar(255) NOT NULL,
	CONSTRAINT "tag_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "art_tag" (
	"id" serial NOT NULL,
	"art_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "art_tag_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "note" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"note" TEXT NOT NULL,
	"access_id" integer NOT NULL,
	"date" TIMESTAMP NOT NULL,
	CONSTRAINT "note_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "user_media" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"media_id" integer NOT NULL,
	CONSTRAINT "user_media_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "framegrab_note" (
	"id" serial NOT NULL,
	"note_id" integer NOT NULL,
	"framegrab_id" integer NOT NULL,
	CONSTRAINT "framegrab_note_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "media_movie_note" (
	"id" serial NOT NULL,
	"movie_id" integer NOT NULL,
	"note_id" integer NOT NULL,
	"framegrab_id" integer NOT NULL,
	"seen" BOOLEAN NOT NULL,
	CONSTRAINT "media_movie_note_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "media_note" (
	"id" serial NOT NULL,
	"media_id" integer NOT NULL,
	"note_id" integer NOT NULL,
	CONSTRAINT "media_note_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "art_note" (
	"id" serial NOT NULL,
	"note_id" integer NOT NULL,
	"art_id" integer NOT NULL,
	CONSTRAINT "art_note_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "follow_table" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"followeduser_id" integer NOT NULL,
	CONSTRAINT "follow_table_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "specialfeature_note" (
	"id" serial NOT NULL,
	"note_id" integer NOT NULL,
	"specialfeature_id" integer NOT NULL,
	"seen" BOOLEAN NOT NULL DEFAULT 'false',
	CONSTRAINT "specialfeature_note_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "art_artist" (
	"id" serial NOT NULL,
	"art_id" integer NOT NULL,
	"artist_id" integer NOT NULL,
	CONSTRAINT "art_artist_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "artist_note" (
	"id" serial NOT NULL,
	"note_id" integer NOT NULL,
	"artist_id" integer NOT NULL,
	CONSTRAINT "artist_note_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "access" (
	"id" serial NOT NULL,
	"type" varchar(50) NOT NULL UNIQUE,
	"description" varchar(255) NOT NULL,
	CONSTRAINT "access_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


ALTER TABLE "media_movie" ADD CONSTRAINT "media_movie_fk0" FOREIGN KEY ("movie_id") REFERENCES "movie"("id");
ALTER TABLE "media_movie" ADD CONSTRAINT "media_movie_fk1" FOREIGN KEY ("media_id") REFERENCES "media"("id");

ALTER TABLE "media_specialfeature" ADD CONSTRAINT "media_specialfeature_fk0" FOREIGN KEY ("media_id") REFERENCES "media"("id");
ALTER TABLE "media_specialfeature" ADD CONSTRAINT "media_specialfeature_fk1" FOREIGN KEY ("specialfeature_id") REFERENCES "specialfeature"("id");

ALTER TABLE "movie_art" ADD CONSTRAINT "movie_art_fk0" FOREIGN KEY ("movie_id") REFERENCES "movie"("id");
ALTER TABLE "movie_art" ADD CONSTRAINT "movie_art_fk1" FOREIGN KEY ("art_id") REFERENCES "art"("id");

ALTER TABLE "art_tag" ADD CONSTRAINT "art_tag_fk0" FOREIGN KEY ("art_id") REFERENCES "art"("id");
ALTER TABLE "art_tag" ADD CONSTRAINT "art_tag_fk1" FOREIGN KEY ("tag_id") REFERENCES "tag"("id");

ALTER TABLE "note" ADD CONSTRAINT "note_fk0" FOREIGN KEY ("user_id") REFERENCES "user"("id");
ALTER TABLE "note" ADD CONSTRAINT "note_fk1" FOREIGN KEY ("access_id") REFERENCES "access"("id");

ALTER TABLE "user_media" ADD CONSTRAINT "user_media_fk0" FOREIGN KEY ("user_id") REFERENCES "user"("id");
ALTER TABLE "user_media" ADD CONSTRAINT "user_media_fk1" FOREIGN KEY ("media_id") REFERENCES "media"("id");

ALTER TABLE "framegrab_note" ADD CONSTRAINT "framegrab_note_fk0" FOREIGN KEY ("note_id") REFERENCES "note"("id");
ALTER TABLE "framegrab_note" ADD CONSTRAINT "framegrab_note_fk1" FOREIGN KEY ("framegrab_id") REFERENCES "framegrab"("id");

ALTER TABLE "media_movie_note" ADD CONSTRAINT "media_movie_note_fk0" FOREIGN KEY ("movie_id") REFERENCES "media_movie"("id");
ALTER TABLE "media_movie_note" ADD CONSTRAINT "media_movie_note_fk1" FOREIGN KEY ("note_id") REFERENCES "note"("id");
ALTER TABLE "media_movie_note" ADD CONSTRAINT "media_movie_note_fk2" FOREIGN KEY ("framegrab_id") REFERENCES "framegrab"("id");

ALTER TABLE "media_note" ADD CONSTRAINT "media_note_fk0" FOREIGN KEY ("media_id") REFERENCES "media"("id");
ALTER TABLE "media_note" ADD CONSTRAINT "media_note_fk1" FOREIGN KEY ("note_id") REFERENCES "note"("id");

ALTER TABLE "art_note" ADD CONSTRAINT "art_note_fk0" FOREIGN KEY ("note_id") REFERENCES "note"("id");
ALTER TABLE "art_note" ADD CONSTRAINT "art_note_fk1" FOREIGN KEY ("art_id") REFERENCES "art"("id");

ALTER TABLE "follow_table" ADD CONSTRAINT "follow_table_fk0" FOREIGN KEY ("user_id") REFERENCES "user"("id");
ALTER TABLE "follow_table" ADD CONSTRAINT "follow_table_fk1" FOREIGN KEY ("followeduser_id") REFERENCES "user"("id");

ALTER TABLE "specialfeature_note" ADD CONSTRAINT "specialfeature_note_fk0" FOREIGN KEY ("note_id") REFERENCES "note"("id");
ALTER TABLE "specialfeature_note" ADD CONSTRAINT "specialfeature_note_fk1" FOREIGN KEY ("specialfeature_id") REFERENCES "specialfeature"("id");

ALTER TABLE "art_artist" ADD CONSTRAINT "art_artist_fk0" FOREIGN KEY ("art_id") REFERENCES "art"("id");
ALTER TABLE "art_artist" ADD CONSTRAINT "art_artist_fk1" FOREIGN KEY ("artist_id") REFERENCES "artist"("id");

ALTER TABLE "artist_note" ADD CONSTRAINT "artist_note_fk0" FOREIGN KEY ("note_id") REFERENCES "note"("id");
ALTER TABLE "artist_note" ADD CONSTRAINT "artist_note_fk1" FOREIGN KEY ("artist_id") REFERENCES "artist"("id");