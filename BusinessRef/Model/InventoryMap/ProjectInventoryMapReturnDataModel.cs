using BusinessRef.Abstract;
using System;
using System.Text;

namespace BusinessRef.Model.InventoryMap
{
    public class ProjectInventoryMapReturnDataModel : ErrorStatus
    {
        public string ImageFileName { get; set; }
        public string ImageFileUrl { get; set; }
    }
}
