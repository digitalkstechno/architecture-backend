import ProjectStage from "../models/projectstage.model.js";

export const createProjectStage = async(data, tenantId)=>{

  return await ProjectStage.create({...data, tenantId});
};
export const getProjectStage = async (tenantId) => {
  return await ProjectStage
    .find({ tenantId: tenantId })
    .populate("projectId");
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