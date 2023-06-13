const connexion = require('../../../db-config');
const db = connexion.promise();

const getOne = (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.query('select * from track where id = ?', [id])
    .then(([track]) => {
      if (track.length > 0) {
        res.status(200).json(track[0]);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error when try to retrieve track');
    });
};

const getAll = (req, res) => {
  db.query('select * from track')
    .then(([track]) => {
      res.status(200).send(track);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error when try to get data');
    });
};

const postTracks = (req, res) => {
  const { title, youtube_url, id_album } = req.body;
  db.query(
    'insert into track (title, youtube_url, id_album) values (?, ?, ?)',
    [title, youtube_url, id_album]
  )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        // res.location(`/api/tracks/${result.insertId}`).sendStatus(201);
        res
          .status(201)
          .json({ title, youtube_url, id_album, id: result.insertId });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error when try to insert track');
    });
};

const updateTracks = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, youtube_url, id_album } = req.body;
  db.query(
    'update track set title = ?, youtube_url = ?, id_album = ? where id = ?',
    [title, youtube_url, id_album, id]
  ).then(([result]) => {
    if (result.affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  });
};

const deleteTracks = (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.query('delete from track where id = ?', [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error when delete track');
    });
};

module.exports = { getOne, getAll, postTracks, updateTracks, deleteTracks };
