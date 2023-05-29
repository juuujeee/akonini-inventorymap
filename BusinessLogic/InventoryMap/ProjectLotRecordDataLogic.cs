using BusinessRef.Interfaces.Customs;
using BusinessRef.Interfaces.Generics;
using BusinessRef.Model.InventoryMap;
using DataAccess.InventoryMap;

using model = BusinessRef.Model.InventoryMap.ProjectLotRecordReturnDataModel;

namespace BusinessLogic.InventoryMap
{
    public class ProjectLotRecordDataLogic : IGetProjectLotRecordData
    {
        private readonly ProjectLotRecordParamDataModel _dataModel;
        public ProjectLotRecordDataLogic(ProjectLotRecordParamDataModel dataModel)
        {
            _dataModel = dataModel;
        }

        public model GetProjectLotRecordData()
        {
            IGetDatabaseData<model> data = new ProjectLotRecordDataAccess(_dataModel);

            return data.GetDatabaseData();
        }
    }
}
