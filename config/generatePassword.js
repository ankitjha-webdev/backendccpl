const bcrypt = require("bcrypt");
const crypto = require('crypto');

async function genratePassword(password) {
  const salt = await bcrypt.genSalt();
  Userpassword = await bcrypt.hash(password, salt);
  console.log(Userpassword);
}

genratePassword("CCPLADMIN@123")

const passgen = crypto.randomBytes(64).toString("hex")
console.log(passgen, "Yessssssssssssss");