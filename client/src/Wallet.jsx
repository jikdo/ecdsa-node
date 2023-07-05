import * as secp from 'ethereum-cryptography/secp256k1'
import  * as utils from 'ethereum-cryptography/utils'
import server from "./server";
import { useState } from 'react';

function Wallet({ privateKey, setPrivateKey, balance, setBalance}) {

  async function onChange(evt) {
   
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const publicKey = utils.toHex(secp.secp256k1.getPublicKey(utils.hexToBytes(privateKey)))
 
    if (publicKey) {
      const {
        data: { balance },
      } = await server.get(`balance/${publicKey}`);
      setBalance(balance);
    } else {
      setBalance(2);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet privateKey
        <input placeholder="Type a private key" value={privateKey} onChange={onChange}></input>
      </label>


      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
