// controller/tenant.controller.js

import { sendTenantWelcomeMail } from "../mail/onboardmail.js";
import Tenant from "../models/tenant.model.js";
import { createTenantAdminRole } from "../service/createTenantAdminRole.service.js";
import { createTenantAdminUser } from "../service/user.service.js";

export const CreateTenantController = async (req, res) => {
  try {
    const { tenantName, tenantPhoneNo, email } = req.body;

    // 1. Create Tenant
    const tenant = await Tenant.create({
      tenantName,
      tenantPhoneNo,
      subscription: {
        status: "TRIAL",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      isActive: true,
    });
    console.log("🚀 ~ CreateTenantController ~ tenant:", tenant)

    if(!tenant){
      console.log("tennant not found");
    }

    // 2. Create Role + Permissions
    if (tenant) {
      const role = await createTenantAdminRole(tenant._id);

      // 3. Create Admin User
      const { user, plainPassword } = await createTenantAdminUser({
        tenantId: tenant._id,
        roleId: role._id,
        email,
        tenantName
      });

      // 4. Send Email
      await sendTenantWelcomeMail({
        email,
        userName: user.userName,
        password: plainPassword,
      });

      return res.status(201).json({
        message: "Tenant created & email sent",
        tenantId: tenant._id,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
