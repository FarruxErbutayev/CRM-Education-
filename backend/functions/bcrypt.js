'use strict'

import bcrypt from "bcrypt";

async function hash(password){
    const salt = bcrypt.genSaltSync(11);
    const hash = bcrypt.hashSync(password, salt);
    console.log(password, 'password')
    return hash;
};


async function check(password, hash){
  const result = await bcrypt.compare(password, hash);
  return result;
};

export {hash, check};