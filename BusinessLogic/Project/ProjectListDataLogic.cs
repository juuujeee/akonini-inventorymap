using BusinessRef.Interfaces.Customs;
using BusinessRef.Interfaces.Generics;

using DataAccess.Project;
using BusinessRef.Model.Project;

using model = BusinessRef.Model.Project.ProjectListReturnDataModel;
using BusinessRef.Helper;

namespace BusinessLogic.Project
{
    public class ProjectListDataLogic : IGetProjectListData
    {
        private readonly ProjectListParamDataModel _dataModel;
        public ProjectListDataLogic(ProjectListParamDataModel dataModel)
        {
            _dataModel = dataModel;
        }

        public model GetProjectListData()
        {
            IGetDatabaseData<model> data = new ProjectListDataAccess(_dataModel);

            return data.GetDatabaseData();
        }
    }
}
