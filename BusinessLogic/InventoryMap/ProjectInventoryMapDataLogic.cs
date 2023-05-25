using BusinessRef.Interfaces.Customs;
using BusinessRef.Interfaces.Generics;
using BusinessRef.Model.InventoryMap;
using DataAccess.InventoryMap;

using model = BusinessRef.Model.InventoryMap.ProjectInventoryMapReturnDataModel;


namespace BusinessLogic.InventoryMap
{
    public class ProjectInventoryMapDataLogic : IGetProjectInventoryMapData
    {
        private readonly ProjectInventoryMapParamDataModel _dataModel;
        public ProjectInventoryMapDataLogic(ProjectInventoryMapParamDataModel dataModel)
        {
            _dataModel = dataModel;
        }

        public model GetProjectInventoryMapData()
        {
            IGetDatabaseData<model> data = new ProjectInventoryMapDataAccess(_dataModel);

            return data.GetDatabaseData();
        }
    }
}
