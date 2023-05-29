using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessRef.Model.InventoryMap
{
    public class ProjectLotRecordDataModel
    {
        public int ProjectLotID { get; set; }
        public int LotID { get; set; }
        public int ProjectLotStatusID { get; set; }
        public string ProjectLotStatusName { get; set; }
        public string LotName { get; set; }
    }
}
