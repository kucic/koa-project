import mongoose, {Schema} from "mongoose";
import bcrypt from 'bcrypt'; 

const UserSchema = new Schema({
  username: String,
  hashedPassword: String,
});

/** 
 * 인스턴스 메서드
*/
// this 는 schema instance 를 가리킨다. 
/**
 * 
 * @param {string} password 
 */
UserSchema.methods.setPassword = async function(password) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
}
/**
 * 
 * @param {string} password 
 * @returns 
 */
UserSchema.method.checkPassword = async function(password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result;
}
/**
 * 스테틱 메서드
 * @param {string} username 
 * @returns 
 */
UserSchema.statics.findByUsername = function(username) {
  // this 는 model 을 가리킨다. (schema instatance 가 아니다.)
  return this.findOne({username});
}

// serialize
UserSchema.methods.serialize = function() {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
}

// token  gelerate
UserSchema.methods.generateToken = function() {
  const token = jwt.sign(
    // 첫 번째 파라미터에는 토큰 안에 집어넣고 싶은 데이터를 넣는다. 
    {
      _id: this.id,
      username: this.username,
    },
    process.env.JWT_SECRET, // 두번째 파라미터는 JWT 암호
    {
      expiresIn: '7d', // 7일간 유효
    }
  )
  return token;
}

const User = mongoose.model('User', UserSchema);

export default User;