const {Schema}=require('mongoose')
const {model}=require('mongoose')
const bcrypt= require('bcrypt')

    const UserSchema = new Schema({
        user: {type: String, required: true, unique:true},
        email: {type: String, required: true},
        password: {type: String, required: true}
    });
   





/*
UserSchema.pre('save', function(next){
    if(this.isNew || this.isModified('password')){
        const document = this;
        bcrypt.hash(document.password, 10, (err, hashedPassword)=>{
            if (err){
                next(err)
            }else{
                document.password = hashedPassword
                next()
            }
        })
    }else{
        next()
    }
})
/*
UserSchema.methods.isCorrectPassword = async function (password) {
  const compare = util.promisify(bcrypt.compare);

  try {
    const result = await compare(password, this.password);
    return result;
  } catch (err) {
    throw new Error(err);
  }
};
*/
module.exports = model('User', UserSchema);