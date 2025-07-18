-- SELECT
--   movie.id AS movie_id,
--   movie.videos_id,
--   movie.subs_id,
--   streamed.title,
--   streamed.release_date,
--   streamed.description,
--   streamed.language,
--   streamed.id AS streamed_id,
--   streamed.rating_average,
--   streamed.cover_image_url,
--   streamed.banner_image_url,
--   streamed.trailer_url,
--   streamed.age_rating,
--   streamed.status,
--   streamed.country, -- <--- THIS IS WHERE THE MISSING COMMA IS CRITICAL
--   v.quality,
--   v.file_url,
--   sb.language AS sub_language,
--   sb.file_url AS sub_url,
--   streamed_review.id AS streamed_review_id,
--   streamed_review.rating,
--   streamed_review.user_id,
--   streamed_review.comment,
--   users.username
-- FROM movie
-- LEFT JOIN streamed ON movie.streamed_id = streamed.id
-- LEFT JOIN video AS v ON movie.videos_id = v.videos_id -- Ensure you are aliasing 'video' to 'v'
-- LEFT JOIN sub AS sb ON movie.subs_id = sb.subs_id 
-- LEFT JOIN streamed_review ON movie.streamed_id = streamed_review.streamed_id
-- LEFT JOIN users ON  streamed_review.user_id = users.id   -- Ensure you are aliasing 'sub' to 'sb'
-- WHERE movie.id = 1;

-- ---
-- SELECT
--   streamed_review.rating,
--   streamed_review.user_id,
--   streamed_review.comment,
--   users.username
-- FROM streamed_review
-- LEFT JOIN users ON streamed_review.user_id = users.id
-- WHERE streamed_review.streamed_id = 19

-- ---
-- INSERT INTO movie (streamed_id, release_date, videos_id, subs_id)
-- VALUES ($1,$2,$3,$4)

SELECT
  series.id AS series_id,
  streamed.title,
  streamed.release_date,
  streamed.description,
  streamed.language,
  streamed.id AS streamed_id,
  streamed.rating_average,
  streamed.cover_image_url,
  streamed.banner_image_url,
  streamed.trailer_url,
  streamed.age_rating,
  streamed.status,
  streamed.country, 
  season.id AS season_id,
  season.season_number,
  season.release_date AS season_release_date,
  season.season_name,
  episode.episode_number,
  episode.title AS episode_title,
  episode.description AS episode_description,
  episode.duration_minutes,
  episode.release_date AS episode_release_date,
  episode.videos_id,
  episode.subs_id,
  epuser.username AS epusername,
  episode_review.comment AS ep_comment,
  episode_review.thumbs_up,
  streamed_review.id AS streamed_review_id,
  streamed_review.rating,
  streamed_review.user_id,
  streamed_review.comment,

  users.username
FROM series
LEFT JOIN streamed ON series.streamed_id = streamed.id
LEFT JOIN streamed_review ON series.streamed_id = streamed_review.streamed_id
LEFT JOIN users ON  streamed_review.user_id = users.id  
LEFT JOIN season ON series.id = season.series_id
LEFT JOIN episode ON season.id = episode.season_id
LEFT JOIN episode_review ON episode.id = episode_review.id
LEFT JOIN users AS epuser ON episode_review.episode_id = users.id
WHERE series.id = 1;
-- INSERT INTO streamed_review (user_id, streamed_id, rating, comment)
-- VALUES
 
--   (88, 20, 5, 'Amazing visuals.'),
--   (88, 21, 4, 'Good pacing.'),
--   (88, 22, 5, 'Well directed.'),
--   (88, 23, 3, 'Could be better.'),
--   (88, 24, 4, 'Enjoyable watch.'),
--   (88, 25, 5, 'Unique plot.'),
--   (88, 26, 4, 'Great cinematography.'),
--   (88, 27, 5, 'Compelling!'),
--   (88, 28, 4, 'Solid performance.'),
--   (88, 29, 3, 'Nice but slow.'),
--   (88, 30, 4, 'Beautifully shot.'),
--   (88, 31, 4, 'Clever editing.'),
--   (88, 32, 5, 'Deep and emotional.'),
--   (88, 33, 5, 'Mind-bending.'),
--   (88, 34, 4, 'Great atmosphere.'),
--   (88, 43, 4, 'Ironman Ironman'),
--   (88, 40, 4, 'Thanose is a ginuse vilan');
-- DO $$
-- BEGIN
--   FOR i IN 1..32 LOOP
--     INSERT INTO episode_review (user_id, episode_id, thumbs_up, comment)
--     VALUES
--       (88, i, TRUE, 'Fantastic episode.'),
--       (87, i, FALSE, 'Not my favorite.');
--   END LOOP;
-- END $$;
INSERT