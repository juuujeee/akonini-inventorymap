using BusinessRef.Abstract;
using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessRef.Model.InventoryMap
{
    public class ProjectInventoryMapReturnDataModel : ErrorStatus
    {
        public ICollection<ProjectInventoryMapRefDataModel> InventoryMap { get; set; }
    }
}
