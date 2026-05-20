const  mongoose = require('mongoose');
const Bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const CaptainSchema = new mongoose.Schema ({
    fullname:{
        firstname :{
            type:String,
            required:true ,
            minlength:[ 3 , "firstname must be at least 3 characters long"]
        },
        lastname :{
            type :String ,
            required:true ,
            minlength:[ 3 , "lastname must be at least 3 characters long"]
        }
        },

    email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Please provide a valid email"]
        },

    password:{
            type:String,
            required:true,
            minlength:[6,"password must be at least 6 characters long"],
            select:false
        },

    socketId :{
        type:String,
        },

    status :{
        type:String,
        enum : ['active', 'inactive'],
        default : 'active'
        },

    vehicle :{
    
        color:{
            type:String,
            required:true,
            minlength:[3 ,'color must be at least 3 characters long'],
              },

        plate:{
            type:String,
            required:true,
            minlength:[3,'plate must be at least 3 characters long'],
              },

        capacity:{
            type:Number,
            required : true,
            min:[1,'capacity must be at least 1'],
              },

        vehicleType:{
            type:String,
            required:true,
            enum:['car','motorcycle','auto',],
               }
        },

    location:{
        lat:{
            type:Number
        },
        lng:{
            type:Number
        }
    }

})


CaptainSchema.methods.generateToken = function() {
    const token = jwt.sign({ _id: this._id 
        , role: "captain"
    }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}

CaptainSchema.methods.comparePassword = async function(password) {
    return await Bcrypt.compare(password, this.password);
   
}

CaptainSchema.statics.hashPassword = async function(password) {
    return await Bcrypt.hash(password, 10);
}


 const CaptainModel = mongoose.model('captian',CaptainSchema);

 module.exports = CaptainModel;

