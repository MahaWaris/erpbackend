const router = require("express").Router();
let Account = require("./accountClass.model");
const bodyParser = require("body-parser").json();

//GET REQUESTS
router.route("/company/:id").get(bodyParser, (req, res) => {
  Account.find({
    company: req.params.id,
  })
    .populate("company")
    .then((account) => res.json(account))
    .catch((err) => res.json("error"));
});

router.route("/:id").get(bodyParser, (req, res) => {
  Account.findById(req.params.id)
    .populate("company")
    .then((account) => res.json(account))
    .catch((err) => res.json("error"));
});

//POST REQUESTS
router.route("/").post(bodyParser, (req, res) => {
  let level1 = req.body.accountType === "Assets" ? 10
    : req.body.accountType === "Liabilities" ? 20
      : req.body.accountType === "Equity" ? 30
        : req.body.accountType === "Revenue" ? 40 : 50
  Account.find({
    company: req.body.company[0],
  }).sort({ createdAt: -1 }).limit(1)
    .populate("company")
    .then((acc) => {
      let code = 0;
      acc.length === 0 ? code = "1".padStart(2,"0") : code = parseInt(acc[0].code) + 1;
      code = `${level1}${code}` 
      const account = new Account({
        company: req.body.company,
        code: code,
        accountType: req.body.accountType,
        name: req.body.name
      });

      account.save()
        .then(() => res.json("Added"))
        .catch(() => console.log("error"));
    })
    .catch(() => res.json("error"));
});

router.route("/:id").post(bodyParser, (req, res) => {
  Account.findByIdAndUpdate(req.params.id, req.body)
    .populate("company")
    .then(() => res.json("Added"))
    .catch((err) => res.json("error"));
});

module.exports = router;