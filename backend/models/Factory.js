const mongoose = require('mongoose');

const factorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    acceptedWasteTypes: [
      {
        type: String
      }
    ],
    location: {
      type: String,
      required: true
    },
    distanceKm: {
      type: Number,
      required: true
    },
    trustScore: {
      type: Number,
      default: 4.8
    },
    vehicleSupport: {
      type: String,
      default: 'รถบรรทุก 6 ล้อ / 10 ล้อ'
    },
    isVerified: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Factory', factorySchema);
