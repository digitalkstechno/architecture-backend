// models/subscriptionPlan.model.js
import mongoose from 'mongoose';

const planModulePermissionSchema = new mongoose.Schema(
  {
    module: { type: String, required: true, trim: true },
    actions: [
      {
        type: String,
        enum: ['CREATE', 'READ', 'UPDATE', 'DELETE']
      }
    ]
  },
  { _id: false }
);

const subscriptionPlanSchema = new mongoose.Schema(
  {
    // no tenantId here – global plan

    name: { type: String, required: true, trim: true },

    price: { type: Number, required: true, min: 0 },

    billingCycle: {
      type: String,
      enum: ['Monthly', 'Yearly', 'One-time'],
      required: true
    },

    // userLimit: { type: Number, required: true, min: 1 },

    // storageLimitGB: { type: Number, required: true, min: 0 },

    isActive: { type: Boolean, default: true },

    features: { type: [String], default: [] },

    modulePermissions: {
      type: [planModulePermissionSchema],
      default: []
    }
  },
  { timestamps: true }
);

export default mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
