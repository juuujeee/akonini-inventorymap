using BusinessRef.Interfaces.Customs;
using BusinessRef.Interfaces.Generics;
using BusinessRef.Model.InventoryMap;
using DataAccess.InventoryMap;

using model = BusinessRef.Model.InventoryMap.ProjectLotFromInventoryMapReturnDataModel;


namespace BusinessLogic.InventoryMap
{
    public class ProjectLotsNewDataLogic : IProjectLotsNewData
    {
        private readonly ProjectLotFromInventoryMapParamDataModel _dataModel;
        public ProjectLotsNewDataLogic(ProjectLotFromInventoryMapParamDataModel dataModel)
        {
            _dataModel = dataModel;
        }
        public model ProjectLotsNewData()
        {
            IPostDatabaseData<model> data = new ProjectLotsNewDataAccess(_dataModel);

            return data.PostDatabaseData();
        }
    }
}
