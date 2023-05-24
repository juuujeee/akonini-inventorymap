using System.Collections.Generic;

namespace BusinessRef.Model.InventoryMap
{
    public class ProjectLotFromInventoryMapParamDataModel
    {
        public ICollection<ProjectLotFromInventoryMapRefDataModel> ProjectLots { get; set; }
        public string SVGFileName { get; set; }
        public int MasterProjectID { get; set; }
        public int MasterPersonID { get; set; }
    }
}
