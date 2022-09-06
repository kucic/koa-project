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

const User = mongoose.model('User', UserSchema);

export default User;