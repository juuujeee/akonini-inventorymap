using BusinessRef.Interfaces.Generics;
using BusinessRef.Model.InventoryMap;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using model = BusinessRef.Model.InventoryMap.ProjectLotFromInventoryMapReturnDataModel;

namespace DataAccess.InventoryMap
{
    public class ProjectLotsNewDataAccess : IPostDatabaseData<model>
    {
        private readonly ProjectLotFromInventoryMapParamDataModel _projectLot;
        public ProjectLotsNewDataAccess(ProjectLotFromInventoryMapParamDataModel projectLot)
        {
            _projectLot = projectLot;
        }

        public model PostDatabaseData()
        {
            IConfigurationBuilder builder = new ConfigurationBuilder();
            builder.AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"));

            var root = builder.Build();
            string connString = root.GetConnectionString("AKONINI_DB");

            model returnDataModel = new model();

            using (SqlConnection con = new SqlConnection(connString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = con;
                    cmd.CommandText = "[akonini.web.developer].spExtractProjectLotFromSVGV2";
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(new SqlParameter { ParameterName = "@ProjectLotTVP", SqlDbType = SqlDbType.Structured, Value = CreateDataTable(_projectLot.ProjectLots), TypeName = "[akonini.web.project].ProjectLotType" });
                    cmd.Parameters.Add(new SqlParameter { ParameterName = "@MasterProjectID", SqlDbType = SqlDbType.Int, Value = _projectLot.MasterProjectID });
                    cmd.Parameters.Add(new SqlParameter { ParameterName = "@SVGFileName", SqlDbType = SqlDbType.NVarChar, Value = _projectLot.SVGFileName });
                    cmd.Parameters.Add(new SqlParameter { ParameterName = "@ImageCaption", SqlDbType = SqlDbType.NVarChar, Value = _projectLot.ImageCaption });
                    cmd.Parameters.Add(new SqlParameter { ParameterName = "@MasterPersonID", SqlDbType = SqlDbType.Int, Value = _projectLot.MasterPersonID });

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.GetSchemaTable().Rows[0].ItemArray[0].ToString() == "ErrorMessage")
                        {
                            if (reader.HasRows)
                            {
                                reader.Read();
                                returnDataModel.HasError = true;
                                returnDataModel.ErrorMessage = reader["ErrorMessage"].ToString();

                            }
                        }
                        else
                        {
                            reader.Read();
                            returnDataModel.StatusCodeNumber = Convert.ToInt32(reader["StatusCodeNumber"]);

                        }
                    }


                }
            }


            return returnDataModel;
        }

        private DataTable CreateDataTable(ICollection<ProjectLotFromInventoryMapRefDataModel> ProjectLots)
        {
            DataTable dt = new DataTable();
            //dt.Columns.Add("PhaseNumber", typeof(string));
            //dt.Columns.Add("BlockNumber", typeof(string));
            dt.Columns.Add("LotID", typeof(int));
            //dt.Columns.Add("MasterProjectID", typeof(int));

            foreach (var lot in ProjectLots)
            {

                //dt.Rows.Add(lot.PhaseNumber);
                //dt.Rows.Add(lot.BlockNumber);
                dt.Rows.Add(lot.LotID);
                //dt.Rows.Add(lot.MasterProjectID);
            }

            return dt;
        }
    }
}
