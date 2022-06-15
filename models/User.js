const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"],
    },
    firstName: {
        type: String,
        required: [true, "Please enter your first name"],
    },
    lastName: {
        type: String,
        required: [true, "Please enter your last name"],
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [8, "Minimum password is 8 characters"],
    },
    confirmPassword: {
        type: String,
        validate: {
            //only work on CREATE and SAVE
            validator: function(el) {
                return el === this.password;
            },
            message: "Password are not the same",
        },
    },
    role: {
        type: String,
        default: "user",
        validate: {
            validator: function(el) {
                if (el != "user") return false;
            },
            message: "You not allow to define user role",
        },
    },
    imageUrl: {
        type: String,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: Date,
    },
}, { timestamps: true });

//before save document
userSchema.pre("save", async function(next) {
    //if not modified password do nothing
    if (!this.isModified("password")) return next();

    //hash password
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

    //delete password confirm field
    this.confirmPassword = undefined;

    next();
});

// static method to login user
userSchema.statics.login = async function(email, password) {
    try {
        const user = await this.findOne({ email });
        if (user) {
            const auth = await bcrypt.compare(password, user.password);
            if (auth) {
                return user;
            }
            throw Error("incorrect password");
        }
        throw Error("incorrect email");
    } catch (error) {
        let errors = "";
        console.log("User.login", error.message);

        if (error.message.includes("data and hash arguments required")) {
            errors = "Please enter password";
        } else {
            errors = error;
        }
        throw Error(errors);
    }
};

//create reset token
userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model("User", userSchema);
// module.exports = User;