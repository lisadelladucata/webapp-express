const connection = require("../data/db");
// Index
const index = (req, res) => {
  const sql = `
  SELECT movies.*, ROUND(AVG(reviews.vote)) as avg_vote
  FROM movies
  LEFT JOIN reviews ON movies.id = reviews.movie_id
  GROUP BY movies.id`;

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });

    const movies = results.map((movie) => {
      movie.image = `${process.env.BE_URL}/movies/${movie.image}`;
      return movie;
    });

    res.json(movies);
  });
};

// Show
const show = (req, res) => {
  const movieSql = `
  SELECT movies.*, ROUND(AVG(reviews.vote)) as avg_vote
  FROM movies
  LEFT JOIN reviews ON movies.id = reviews.movie_id
  WHERE movies.id = ?
  GROUP BY movies.id`;

  const reviewsSql = `
    SELECT *
    FROM reviews
    WHERE movie_id=?
    `;
  const id = req.params.id;

  connection.query(movieSql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Database query failed",
      });
    }

    const movie = results[0];

    if (!movie) {
      res.status(404).json({
        error: "Not Found",
        message: "Movie not found",
      });
    }

    movie.image = `${process.env.BE_URL}/movies/${movie.image}`;

    connection.query(reviewsSql, [id], (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "Database query failed",
        });
      }

      movie.reviews = results;
      res.json(movie);
    });
  });
};

// Create Review
const createReview = (req, res) => {
  const { id } = req.params;

  const { name, vote, text } = req.body;

  const sql =
    "INSERT INTO reviews (movie_id, name, text, vote) VALUES (?, ?, ?, ?)";

  connection.execute(sql, [id, name, text, vote], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Query Error",
        message: `Database query failed`,
      });
    }
    res.status(201).json({ id: results.insertId });
  });
};

// Destroy
const destroy = (req, res) => {
  const sql = `DELETE FROM movies WHERE id = ?`;
  const { id } = req.params.id;

  connection.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Database query failed",
      });
    }

    res.sendStatus(204);
  });
};

module.exports = { index, show, createReview, destroy };
