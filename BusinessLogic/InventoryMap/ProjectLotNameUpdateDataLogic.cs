using BusinessRef.Interfaces.Customs;
using BusinessRef.Interfaces.Generics;
using BusinessRef.Model.InventoryMap;
using DataAccess.InventoryMap;

using model = BusinessRef.Model.InventoryMap.ProjectLotNameUpdateReturnDataModel;

namespace BusinessLogic.InventoryMap
{
    public class ProjectLotNameUpdateDataLogic : IGetProjectLotNameUpdateData
    {
        private readonly ProjectLotNameUpdateParamDataModel _dataModel;
        public ProjectLotNameUpdateDataLogic(ProjectLotNameUpdateParamDataModel dataModel)
        {
            _dataModel = dataModel;
        }

        public model GetProjectLotNameUpdateData()
        {
            IPostDatabaseData<model> data = new ProjectLotNameUpdateDataAccess(_dataModel);

            return data.PostDatabaseData();
        }
    }
}
