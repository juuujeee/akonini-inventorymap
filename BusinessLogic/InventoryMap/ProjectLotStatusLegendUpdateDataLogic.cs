using BusinessRef.Interfaces.Customs;
using BusinessRef.Interfaces.Generics;
using BusinessRef.Model.InventoryMap;
using DataAccess.InventoryMap;

using model = BusinessRef.Model.InventoryMap.ProjectLotStatusLegendUpdateReturnDataModel;


namespace BusinessLogic.InventoryMap
{
    public class ProjectLotStatusLegendUpdateDataLogic : IGetProjectLotStatusLegendUpdateData
    {
        private readonly ProjectLotStatusLegendUpdateParamDataModel _dataModel;
        public ProjectLotStatusLegendUpdateDataLogic(ProjectLotStatusLegendUpdateParamDataModel dataModel)
        {
            _dataModel = dataModel;
        }

        public model GetProjectLotStatusLegendUpdateData()
        {
            IPostDatabaseData<model> data = new ProjectLotStatusLegendUpdateDataAccess(_dataModel);

            return data.PostDatabaseData();
        }
    }
}
