using System;

namespace BusinessRef.Model.Project
{
    public class ProjectListRefDataModel
    {
        public int MasterProjectID { get; set; }
        public string ProjectName { get; set; }
        public DateTime DateAdded { get; set; }
        public int UnitTypeID { get; set; }
        public string UnitType { get; set; }
        public string GMapLink { get; set; }
        public int RentOrSaleID { get; set; }
        public string RentOrSale { get; set; }
        public bool IsRFO { get; set; }
        public int ProvinceID { get; set; }
        public string ProvinceName { get; set; }
        public int CityOrMuniID { get; set; }
        public string CityName { get; set; }
    }
}
