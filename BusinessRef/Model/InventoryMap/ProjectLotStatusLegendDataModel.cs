using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessRef.Model.InventoryMap
{
    public class ProjectLotStatusLegendDataModel
    {
        public int ID { get; set; }
        public int MasterProjectID { get; set; }
        public int ProjectLotStatusID { get; set; }
        public string LegendColor { get; set; }
        public string ProjectLotStatusName { get; set; }
    }
}
