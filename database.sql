CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       role VARCHAR(50) DEFAULT 'user'
);

CREATE TABLE books (
                       id SERIAL PRIMARY KEY,
                       title VARCHAR(255) NOT NULL,
                       author VARCHAR(255) NOT NULL,
                       description TEXT,
                       publish_year INT,
                       quantity INT DEFAULT 1,
                       cover_url VARCHAR(255)
);

CREATE TABLE bookings (
                          id SERIAL PRIMARY KEY,
                          user_id INT REFERENCES users(id),
                          book_id INT REFERENCES books(id),
                          booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          status VARCHAR(50) DEFAULT 'active'
);