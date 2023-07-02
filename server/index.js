const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require('ethereum-cryptography/secp256k1')

app.use(cors());
app.use(express.json());

const balances = {
  "03c630b526095bc2ec8f9837bb1c4a84fac567342b626dd1f89d00492369cfd71a": 100,
  "03610a3cbc7ca692b187ae9f18a42790ed38db91fe3d9f57a13a94e28a94b05c08": 50,
  "03fda2d1649ecbe84366a6450e88183406c2805aeb3e96a54fd0b6cb9156ea193f": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  console.log('received requ')
  const { signature, hash, recipient, amount } = req.body;
  let sender = null
  console.log('what is going on  here')
  for (address of Object.keys(balances)) {
    console.log('verifiying', address)
    if (secp.secp256k1.verify(signature, hash, address)) {
      sender = address
      console.log(sender, 'a')
      break
    }
  }

  if (!sender) {
    // if no sender found, get puublic key from sig
    setInitialBalance('');
  }
  


  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
