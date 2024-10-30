import mongoose from "mongoose";

const EducationSchema=new mongoose.Schema({

    school:{
        type:String,
        default:""
    },
    degree:{
        type:String,
        default:''
    },
    fieldofStudy:{
        type:String,
        default:''
    }
})
const WorkSchema=new mongoose.Schema({

    cpmpany:{
        type:String,
        default:""
    },
    position:{
        type:String,
        default:''
    },
    years:{
        type:String,
        default:''
    }
})


const profileSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    bio:{
        type:String,
        default:''
    },
    pastWork:{
        type:[WorkSchema],
        default:[]
    },
    education:{
        type:[EducationSchema],
        default:[]
    }
})

const profile= mongoose.model("Profile",profileSchema);

export default profile;