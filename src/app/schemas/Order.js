import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },

    products: [
      {
        id: {
          type: Number,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number, 
          required: true,
        },
        category: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],

    status: {
      type: String,
      required: true,
    },


    address: {
      type: String,
      required: true,
    },

    
    delivery: {
      deliveryTax: { type: Number, default: null }, 
      km: { type: Number, default: null },
      etaMinutes: { type: Number, default: null },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", OrderSchema);
