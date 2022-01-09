const crypto = require('crypto')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please write your name']
    },
    email: {
        type: String,
        required: [true, 'write email pls'],
        unique: true,
        lowercase: true,   // it's not validator it just will convert email to lower case
        validate: [validator.isEmail, 'please provide valid email']
    },
    photo: {
            type: String,
            default: 'default.jpg' 
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide',  'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required:  [true, 'please provide password'],
        minlength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'please confirm password'],
        minlength: 8,
        select: false,
        validate: { 
            // THIS IS ONLY WORKS ON CREATE AND SAVE
            validator: function(val){
                return this.password === val
            },
            message: `password doesn't match`
        }
        
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,       // not show in the output
    }
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    // hashing password with cost 12
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined;
    next();   
})

userSchema.pre('save', function(next){
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;

    next()

})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
} 
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        console.log('hereeeeeeeeeeeeeeeeeeee')
       // console.log(changedTimeStamp, JWTTimestamp)
        return JWTTimestamp < changedTimeStamp
    }
    
    return false //  means tot changesd;
}


userSchema.methods.createPasswordResetToken = function(){

    // we should never store a reset token into database
    const resetToken = crypto.randomBytes(32).toString('hex')

  this.passwordResetToken =  crypto.createHash('sha256').update(resetToken).digest('hex')

    this.passwordResetExpires =Date.now()  +  10  * 60 * 1000;
    // we save data only in encrypted way
    // console.log({ resetToken}, this.passwordResetToken)
    return resetToken
}

userSchema.pre(/^find/, function(next){   // it will work with every query with find init  findAndDelete findAndUpdate for example
    // this points to current query
    // console.log('works')
  //  this.find({active: true})
    this.find({active: {$ne: false} })
    next()
})
const User = mongoose.model('USER',  userSchema)


module.exports = User



