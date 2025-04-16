const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShiftSchema = new Schema(
    {
        shiftCode: { type: String, required: true, unique: true }, 
        fromTime: { type: Date, required: true }, 
        toTime: { type: Date, required: true },    
    }, 
    { 
        timestamps: true 
    }
);

module.exports = mongoose.model('shifts', ShiftSchema);
