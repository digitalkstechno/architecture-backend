import ProjectStage from "../models/projectstage.model.js";

export const createProjectStage = async(data, tenantId)=>{

  return await ProjectStage.create({...data, tenantId});
};
export const getProjectStage = async (queryParams, tenantId) => {

  let filter = {
    tenantId: tenantId,
  };

  if (queryParams.stageName) {
    filter.stageName = {
      $regex: queryParams.stageName,
      $options: "i",
    };
  }

  if (queryParams.order) {
    filter.order = Number(queryParams.order); // ✅ FIX
  }

  if (queryParams.status) {
    filter.status = {
      $regex: queryParams.status,
      $options: "i",
    };
  }

  console.log("FINAL FILTER:", filter); // 👈 check this

  const projectstage = await ProjectStage.find(filter)
    .sort({ createdAt: -1 })
    .lean()
    .populate("projectId");

  return projectstage;
};
export const getProjectStageById = async(id, tenantId)=>{

  return await ProjectStage.findOne({_id : id, tenantId : tenantId}).populate("projectId");
};
export const updateProjectStage = async(id,data, tenantId)=>{

  return await ProjectStage.findOneAndUpdate({ _id: id, tenantId: tenantId }, data, {
    new: true,
  });
};
export const deleteProjectStage = async(id, tenantId)=>{

  return await ProjectStage.findOneAndDelete({_id : id, tenantId : tenantId});
};