const models = require('../models');

const { Domo } = models;

const makeDomo = (req, res) => {
  if (!req.body || !req.body.age) {
    return res.status(400).json({ error: 'Both name and age are required dude.' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists man.' });
    }

    return res.status(400).json({ error: 'An error occured; Sorry.' });
  });


  return domoPromise;
};

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) =>
  {
    if(err)
    {
      console.log(err);
      return res.status(400).json({err: 'An error occurred. Sorry about that.'});
    }

    return res.render('app', {domos: docs});
  });
};

module.exports.makerPage = makerPage;
module.exports.make = makeDomo;
