// controller/tenant.controller.js

import { sendClientWelcomeMail } from "../mail/onboardmail.js";
import Client from "../models/client.model.js";
import { createClient } from "../service/client.service.js";
import { createClientRole } from "../service/createClientRole.service.js";




export const CreateClientController = async (req, res) => {
  try {

    const tenantId = req.user.tenantId; // from logged-in tenant

    const { clientName, phone, email, address, notes } = req.body;

    // 1️⃣ Create Role (ONLY ONCE PER TENANT ideally)
    const role = await createClientRole(tenantId);

    // 2️⃣ Create Client (LOGIN USER)
    const { user, plainPassword } = await createClient({
      tenantId,
      roleId: role._id,
      email,
      clientName,
    });

    // 3️⃣ Send Email
    await sendClientWelcomeMail({
      email,
      userName: clientName,
      password: plainPassword,
    });

    return res.status(201).json({
      message: "Client created & email sent",
      client: user
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
