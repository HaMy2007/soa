const { default: mongoose } = require('mongoose');

module.exports = {
    multipleMongooseToObject: function (mongooses) {
        // return mongooses.map((mongooses) => mongooses.toObject());
        return Array.isArray(mongooses)
            ? mongooses.map((mongooseDoc) => mongooseDoc.toObject())
            : [];
    },
    mongooseToObject: function (mongoose) {
        return mongoose ? mongoose.toObject() : mongoose;
    },
    
};
