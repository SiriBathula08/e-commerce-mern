import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
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

    brand: {
      type: String,
      default: "Generic",
    },

    stock: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      default: "no-image.jpg",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
