using BusinessRef.Interfaces.Customs;
using BusinessRef.Interfaces.Generics;
using BusinessRef.Model.InventoryMap;
using DataAccess.InventoryMap;

using model = BusinessRef.Model.InventoryMap.ProjectLotStatusUpdateReturnDataModel;

namespace BusinessLogic.InventoryMap
{
    public class ProjectLotStatusUpdateDataLogic : IGetProjectLotStatusUpdateData
    {
        private readonly ProjectLotStatusUpdateParamDataModel _dataModel;
        public ProjectLotStatusUpdateDataLogic(ProjectLotStatusUpdateParamDataModel dataModel)
        {
            _dataModel = dataModel;
        }

        public model GetProjectLotStatusUpdateData()
        {
            IPostDatabaseData<model> data = new ProjectLotStatusUpdateDataAccess(_dataModel);

            return data.PostDatabaseData();
        }
    }
}
