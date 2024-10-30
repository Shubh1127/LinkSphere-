import mongoose, { mongo } from "mongoose";

const connectionSchema=mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    connectionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    status_accepted:{
        type:Boolean,
        default:null,
    }

})
const connectionRequest=mongoose.model("ConnectionRequest",connectionSchema)
export default connectionRequest;