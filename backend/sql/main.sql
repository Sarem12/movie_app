-- USERS
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name VARCHAR(50)
    second_name VARCHAR(50)
    profile_img_url VARCHAR(50)
    created_at TIMESTAMP DEFAULT NOW()
);

-- TAGS (with population score added)
CREATE TABLE tag (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    population_score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- USER-TAG Relationship (with like points)
CREATE TABLE user_tag_points (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    tag_id BIGINT REFERENCES tag(id) ON DELETE CASCADE,
    like_points INT DEFAULT 0,
    PRIMARY KEY (user_id, tag_id)
);

-- GENRES
CREATE TABLE genres (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- PRODUCTIONS
CREATE TABLE productions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100),
    logo_url VARCHAR(500),
    country VARCHAR(50)
);

-- STREAMERS
CREATE TABLE streamers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100),
    logo_url VARCHAR(500),
    website_url VARCHAR(200)
);

-- STREAMED (base for movie or series)
CREATE TABLE streamed (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255),
    release_date DATE,
    description TEXT,
    original_title VARCHAR(255),
    language VARCHAR(50),
    country VARCHAR(50),
    rating_average DECIMAL(3,2),
    cover_image_url VARCHAR(500),
    banner_image_url VARCHAR(500),
    trailer_url VARCHAR(500),
    age_rating VARCHAR(20),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- MOVIE
CREATE TABLE movie (
    id BIGSERIAL PRIMARY KEY,
    streamed_id BIGINT REFERENCES streamed(id) ON DELETE CASCADE,
    release_date DATE,
    videos_id BIGINT,
    subs_id BIGINT
);

-- SERIES
CREATE TABLE series (
    id BIGSERIAL PRIMARY KEY,
    streamed_id BIGINT REFERENCES streamed(id) ON DELETE CASCADE,
    start_year BIGINT,
    end_year BIGINT
);

-- SEASON
CREATE TABLE season (
    id BIGSERIAL PRIMARY KEY,
    series_id BIGINT REFERENCES series(id) ON DELETE CASCADE,
    season_number INT,
    release_date DATE,
    season_name VARCHAR(100)
);

-- EPISODE
CREATE TABLE episode (
    id BIGSERIAL PRIMARY KEY,
    season_id BIGINT REFERENCES season(id) ON DELETE CASCADE,
    episode_number INT,
    title VARCHAR(255),
    description TEXT,
    duration_minutes BIGINT,
    release_date DATE,
    videos_id BIGINT,
    subs_id BIGINT
);

-- ACTOR
CREATE TABLE actor (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100),
    profile_image_url VARCHAR(500),
    bio TEXT,
    birth_date DATE,
    nationality VARCHAR(50)
);

-- STREAMED_ACTORS
CREATE TABLE streamed_actors (
    id BIGSERIAL PRIMARY KEY,
    streamed_id BIGINT REFERENCES streamed(id) ON DELETE CASCADE,
    actor_id BIGINT REFERENCES actor(id),
    character_name VARCHAR(100),
    role_order INT
);

-- STREAMED_GENRES
CREATE TABLE streamed_genres (
    id BIGSERIAL PRIMARY KEY,
    streamed_id BIGINT REFERENCES streamed(id) ON DELETE CASCADE,
    genre_id BIGINT REFERENCES genres(id)
);

-- STREAMED_TAG
CREATE TABLE streamed_tag (
    id BIGSERIAL PRIMARY KEY,
    streamed_id BIGINT REFERENCES streamed(id) ON DELETE CASCADE,
    tag_id BIGINT REFERENCES tag(id)
);

-- STREAMED_STREAMERS
CREATE TABLE streamed_streamers (
    id BIGSERIAL PRIMARY KEY,
    streamed_id BIGINT REFERENCES streamed(id) ON DELETE CASCADE,
    streamers_id BIGINT REFERENCES streamers(id)
);

-- STREAMED_PRODUCTION
CREATE TABLE streamed_production (
    id BIGSERIAL PRIMARY KEY,
    streamed_id BIGINT REFERENCES streamed(id) ON DELETE CASCADE,
    productions_id BIGINT REFERENCES productions(id)
);

-- VIDEOS CONTAINER
CREATE TABLE videos (
    id BIGSERIAL PRIMARY KEY
);

-- VIDEO ENTRIES
CREATE TABLE video (
    id BIGSERIAL PRIMARY KEY,
    videos_id BIGINT REFERENCES videos(id) ON DELETE CASCADE,
    quality VARCHAR(50),
    file_url VARCHAR(500)
);

-- SUBTITLES CONTAINER
CREATE TABLE subs (
    id BIGSERIAL PRIMARY KEY
);

-- SUBTITLE ENTRIES
CREATE TABLE sub (
    id BIGSERIAL PRIMARY KEY,
    subs_id BIGINT REFERENCES subs(id) ON DELETE CASCADE,
    language VARCHAR(50),
    file_url VARCHAR(500)
);

-- HISTORY (User watching record)
CREATE TABLE history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    streamed_id BIGINT REFERENCES streamed(id),
    episode_id BIGINT REFERENCES episode(id),
    watched_at TIMESTAMP DEFAULT NOW()
);

-- STREAMED REVIEW (Rating & comment)
CREATE TABLE streamed_review (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    streamed_id BIGINT REFERENCES streamed(id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- EPISODE REVIEW (Thumbs up/down)
CREATE TABLE episode_review (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    episode_id BIGINT REFERENCES episode(id) ON DELETE CASCADE,
    thumbs_up BOOLEAN,
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
