const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MealSchema = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        description: { type: String, required: true },
        isLocked: { type: Boolean},
        category: { type: String, required: true },
        ingredients: [
            {
                // ingredientID: { type: Schema.Types.ObjectId, ref: 'Ingredient', required: true },
                quantity: { type: Number, required: true },
                name: { type: String, required: true },
            }
        ],
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('meals', MealSchema);