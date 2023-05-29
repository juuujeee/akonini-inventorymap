
namespace BusinessRef.Model.InventoryMap
{
    public class ProjectLotIndividualRefDataModel
    {
        public int ID { get; set; }
        public int LotID { get; set; }
        public int MasterProjectID { get; set; }
        public string LotName { get; set; }
        public int ProjectLotStatusID { get; set; }
        public string ProjectLotStatusName { get; set; }
    } 
}
