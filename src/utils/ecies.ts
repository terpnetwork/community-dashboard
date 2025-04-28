import { PrivateKey, encrypt, decrypt } from 'eciesjs'
import { createCipheriv, randomBytes } from 'crypto'

export default async function encrypt_eth_signature(sig: string) {
  // TODO: implement client side encryption

  /// CRYPTO EXAMPLE
  // const key = randomBytes(32);
  // const iv = randomBytes(16);
  // const cipher = createCipheriv('aes-256-cbc', key, iv);
  // let encrypted = cipher.update(sig, 'utf8', 'hex');
  // encrypted += cipher.final('hex');
  // console.log(encrypted)

  /// ECIES EXAMPLE
  // const kr = new PrivateKey();
  // let pk = new PrivateKey(kr.secret);
  // let pk_hex = pk.toHex();
  // let pub = pk.publicKey.toHex();
  // console.log("pub:", pub);
  // console.log("pri:", pk_hex);
  // const data = Buffer.from(sig)
  // const encrypted = encrypt(pk.publicKey.toHex(), data);
  // const decrypted = await decrypt(pk.secret, encrypted).toString();
  // console.log("Encrypted Buffer Length:", encrypted.length);
  // console.log("input:", sig)
  // console.log("encrypted:", encrypted_data)
  // console.log("decrypted:", decrypted)

  /// SHA256 EXAMPLE

  // COSMJS/SECRETJS EXAMPLE

  // return encrypted;
  return sig
}
