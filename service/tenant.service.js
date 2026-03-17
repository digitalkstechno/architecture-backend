
import SubscriptionPlan from "../models/subscriptionPlan.model.js";
import Tenant from "./../models/tenant.model.js"
export const CreateTenant = async (data) => {
  const trialExpiresAt = new Date(
    Date.now() + 3 * 24 * 60 * 60 * 1000 // 7 days
  );

  return await Tenant.create({
    tenantName: data.tenantName,
    tenantPhoneNo: data.tenantPhoneNo,
    subscription: {
      status: "TRIAL",
      expiresAt: trialExpiresAt, // ✅ REQUIRED FIELD FILLED
    },
    isActive: true,
  });
};


export const GetTenant = async () =>{
    return await Tenant.find().populate('subscription.planId');
}
export const GetTenantById = async (id,) =>{
    return await Tenant.findById(id).populate('subscription.planId');
}
export const UpdateTenant = async (id,data) =>{
    return await Tenant.findByIdAndUpdate(id,data);
}
export const DeleteTenant = async (id) =>{
    return await Tenant.findByIdAndDelete(id);
}


export const activateTenantWithPlan = async ({ tenantId, planId, paymentIntentId }) => {
  const plan = await SubscriptionPlan.findById(planId);
  if (!plan) {
    throw new Error('Subscription plan not found');
  }

  const now = new Date();
  const expiresAt = new Date(now);

  if (plan.billingCycle === 'Monthly') {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  } else if (plan.billingCycle === 'Yearly') {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  } else if (plan.billingCycle === 'One-time') {
    expiresAt.setFullYear(expiresAt.getFullYear() + 10);
  }

  const tenant = await Tenant.findByIdAndUpdate(
    tenantId,
    {
      $set: {
        isActive: true,
        'subscription.status': 'ACTIVE',
        'subscription.expiresAt': expiresAt,
        'subscription.planId': plan._id,
        'subscription.paymentIntentId': paymentIntentId
      }
    },
    { new: true }
  );

  return tenant;
};
