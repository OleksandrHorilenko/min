import mongoose, { Schema, model, models } from "mongoose";

const SoldCardSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true, // Эквивалент автоматической генерации ID
  },

  owner: { type: String, required: true },



  cardId: { 
    type: Number, // ID карты из тиража (числовой)
    required: true 
  },
  //serialNumber: { 
  //  type: Number, 
 //   required: true 
 // }, // Номер карты в рамках тиража

 price: { 
  type: Number, // ID карты из тиража (числовой)
  
},
  
  soldAt: { 
    type: Date, 
    default: Date.now 
  }, // Дата продажи
});



// Экспортируем модель
const SoldCard = models.SoldCard || model("SoldCard", SoldCardSchema);

export default SoldCard;