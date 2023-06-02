using System.Collections.Generic;
using BusinessRef.Abstract;

namespace BusinessRef.Model.InventoryMap
{
    public class ProjectLotRecordReturnDataModel : ErrorStatus
    {
        public ICollection<ProjectLotRecordDataModel> ProjectLotRecords { get; set; }
        public ICollection<ProjectLotStatusLegendDataModel> ProjectLotStatusLegend { get;set; }
    }
}
