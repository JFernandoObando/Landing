const {Schema}=require('mongoose')
const {model}=require('mongoose')

const taskSchema = new Schema({
    title: {
        type:String,
        require:true,
        unique:true,
        trim:true
    },
    description:{
        type:String,
        required:true
    },
    done: {
        type:Boolean,
        default:false
    },
    index: {
        type:String,
        default:false,
        required:false,
        unique:false
    },
    
},{
    timestamps:true,
   // versionKey:true
}
);

module.exports = model('Task', taskSchema);

