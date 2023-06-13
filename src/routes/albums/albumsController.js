const connexion = require('../../../db-config');
const db = connexion.promise();

const getAll = (req, res) => {
  db.query('select * from albums')
    .then(([albums]) => {
      res.status(200).send(albums);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error when try to get data');
    });
};

const getOne = (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.query('select * from albums where id = ?', [id])
    .then(([albums]) => {
      if (albums.length > 0) {
        res.status(200).json(albums[0]);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error when try to retrieve album');
    });
};

const getTracksByAlbumId = (req, res) => {
  const id = parseInt(req.params.id, 10);
  // db.query('select * from track where id_album = ?', [id])
  //   .then(([tracks]) => {
  //     if (tracks.length > 0) {
  //       res.status(200).json(tracks);
  //     } else {
  //       res.sendStatus(404);
  //     }
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     res.status(500).send('Error when try to retrieve tracks');
  //   });
  db.query(
    'select * from albums join track on albums.id = track.id_album where albums.id = ?',
    [id]
  )
    .then(([albums]) => {
      if (albums.length > 0) {
        res.status(200).json(albums);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error when try to retrieve albums');
    });
};

const postAlbums = (req, res) => {
  const { title, genre, picture, artist } = req.body;
  db.query(
    'insert into albums (title, genre, picture, artist) values (?, ?, ?, ?)',
    [title, genre, picture, artist]
  )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        // res.location(`/api/albums/${result.insertId}`).sendStatus(201);
        res
          .status(201)
          .json({ title, genre, picture, artist, id: result.insertId });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error when try to insert album');
    });
};

const updateAlbums = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, genre, picture, artist } = req.body;
  db.query(
    'update albums set title = ?, genre = ?, picture = ?, artist = ? where id = ?',
    [title, genre, picture, artist, id]
  ).then(([result]) => {
    if (result.affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  });
};

const deleteAlbums = (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.query('delete from albums where id = ?', [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error when delete album');
    });
};

module.exports = {
  getAll,
  getOne,
  getTracksByAlbumId,
  postAlbums,
  updateAlbums,
  deleteAlbums,
};
