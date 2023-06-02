using BusinessRef.Abstract;

namespace BusinessRef.Model.InventoryMap
{
    public class ProjectLotStatusLegendUpdateReturnDataModel : ErrorStatus
    {
        public int StatusCodeNumber { get; set; }
        public int ProjectLotStatusLegendID { get; set; }
    }
}
