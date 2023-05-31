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

using model = BusinessRef.Model.InventoryMap.ProjectLotStatusUpdateReturnDataModel;

namespace DataAccess.InventoryMap
{
    public class ProjectLotStatusUpdateDataAccess : IPostDatabaseData<model>
    {
        private readonly ProjectLotStatusUpdateParamDataModel _dataModel;
        public ProjectLotStatusUpdateDataAccess(ProjectLotStatusUpdateParamDataModel dataModel)
        {
            _dataModel = dataModel;
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
                    cmd.CommandText = "[akonini.web.developer].[spUpdateProjectLotStatusV2]";
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(new SqlParameter { ParameterName = "@LotID", SqlDbType = SqlDbType.Int, Value = _dataModel.LotID });
                    cmd.Parameters.Add(new SqlParameter { ParameterName = "@MasterProjectID", SqlDbType = SqlDbType.Int, Value = _dataModel.MasterProjectID });
                    cmd.Parameters.Add(new SqlParameter { ParameterName = "@ProjectLotStatusID", SqlDbType = SqlDbType.Int, Value = _dataModel.ProjectLotStatusID });
                    cmd.Parameters.Add(new SqlParameter { ParameterName = "@MasterPersonID", SqlDbType = SqlDbType.Int, Value = _dataModel.MasterPersonID });

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
                            if (reader.HasRows)
                            {
                                reader.Read();
                                returnDataModel.StatusCodeNumber = Convert.ToInt32(reader["StatusCodeNumber"].ToString());

                            }

                        }
                    }


                }
            }


            return returnDataModel;
        }
    }
}
