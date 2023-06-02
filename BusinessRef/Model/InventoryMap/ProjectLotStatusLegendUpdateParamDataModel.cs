
namespace BusinessRef.Model.InventoryMap
{
    public class ProjectLotStatusLegendUpdateParamDataModel
    {
        public int ID { get; set; }
        public int MasterProjectID { get; set; }
        public int ProjectLotStatusID { get; set; }
        public string LegendColor { get; set; }
        public int MasterPersonID { get; set; }
    }
}
