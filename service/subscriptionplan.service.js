// services/subscriptionPlan.services.js
import SubscriptionPlan from '../models/subscriptionPlan.model.js';

export const createSubscriptionPlan = async data => {
  return await SubscriptionPlan.create(data);
};

export const getSubscriptionPlans = async () => {
  return await SubscriptionPlan.find().sort({ createdAt: -1 });
};

export const getSubscriptionPlanById = async id => {
  return await SubscriptionPlan.findById(id);
};

export const updateSubscriptionPlan = async (id, data) => {
  return await SubscriptionPlan.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });
};

export const deleteSubscriptionPlan = async id => {
  return await SubscriptionPlan.findByIdAndDelete(id);
};
