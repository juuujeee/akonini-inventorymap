using System.Collections.Generic;
using BusinessRef.Abstract;

namespace BusinessRef.Model.InventoryMap
{
    public class ProjectLotUpdateRefReturnDataModel : ErrorStatus
    {
        public ProjectLotIndividualRefDataModel RecordData { get; set; }
        public ICollection<ProjectLotStatusRefDataModel> StatusList { get; set; }
        public int StatusCodeNumber { get; set; }
    }
}
