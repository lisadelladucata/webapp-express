const connection = require("../data/db");
// Index
const index = (req, res) => {
  const sql = `SELECT * FROM movies `;

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    res.json(results);
  });
};

// Show
const show = (req, res) => {
  const movieSql = `SELECT * FROM movies WHERE id = ?`;
  const reviewsSql = `
    SELECT *
    FROM reviews
    WHERE movie_id=?
    `;
  const { id } = req.params.id;

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

    connection.query(reviewsSql, [id], (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "Database query failed",
        });
      }

      post.tags = results;

      res.json(movie);
    });
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

module.exports = { index, show, destroy };
