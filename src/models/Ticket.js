import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ticketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "pending", "cancelled"],
      default: "pending",
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    reservationCode: {
      type: String,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

ticketSchema.plugin(mongoosePaginate);

const TicketModel = mongoose.model("Ticket", ticketSchema);
export default TicketModel;
