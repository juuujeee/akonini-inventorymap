using BusinessRef.Abstract;
using System.Collections.Generic;

namespace BusinessRef.Model.Project
{
    public class ProjectListReturnDataModel : ErrorStatus
    {
        public ICollection<ProjectListRefDataModel> ProjectList { get; set; }
    }
}
