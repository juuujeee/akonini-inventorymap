using BusinessRef.Interfaces.Customs;
using BusinessRef.Interfaces.Generics;
using BusinessRef.Model.InventoryMap;
using DataAccess.InventoryMap;

using model = BusinessRef.Model.InventoryMap.ProjectLotUpdateRefReturnDataModel;

namespace BusinessLogic.InventoryMap
{
    public class ProjectLotUpdateRefDataLogic : IGetProjectLotUpdateRefData
    {
        private readonly ProjectLotUpdateRefParamDataModel _dataModel;
        public ProjectLotUpdateRefDataLogic(ProjectLotUpdateRefParamDataModel dataModel)
        {
            _dataModel = dataModel;
        }

        public model GetProjectLotUpdateRefData()
        {
            IGetDatabaseData<model> data = new ProjectLotUpdateRefDataAccess(_dataModel);

            return data.GetDatabaseData();
        }
    }
}
