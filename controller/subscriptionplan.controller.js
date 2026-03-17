// controller/subscriptionPlan.controller.js
import {
  createSubscriptionPlan,
  getSubscriptionPlans,
  getSubscriptionPlanById,
  updateSubscriptionPlan,
  deleteSubscriptionPlan
} from '../service/subscriptionplan.service.js';

export const createSubscriptionPlanController = async (req, res) => {
  try {
    const plan = await createSubscriptionPlan(req.body);
    return res.status(201).json(plan);
  } catch (error) {
    console.error('createSubscriptionPlanController error:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const getSubscriptionPlansController = async (req, res) => {
  try {
    const plans = await getSubscriptionPlans();
    return res.status(200).json(plans);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getSubscriptionPlanByIdController = async (req, res) => {
  try {
    const plan = await getSubscriptionPlanById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    return res.status(200).json(plan);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateSubscriptionPlanController = async (req, res) => {
  try {
    const plan = await updateSubscriptionPlan(req.params.id, req.body);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    return res.status(200).json(plan);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteSubscriptionPlanController = async (req, res) => {
  try {
    const plan = await deleteSubscriptionPlan(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    return res.status(200).json(plan);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
