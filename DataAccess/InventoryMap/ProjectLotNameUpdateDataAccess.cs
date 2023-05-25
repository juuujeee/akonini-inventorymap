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

using model = BusinessRef.Model.InventoryMap.ProjectLotNameUpdateReturnDataModel;

namespace DataAccess.InventoryMap
{
    public class ProjectLotNameUpdateDataAccess : IGetDatabaseData<model>
    {
        private readonly ProjectLotNameUpdateParamDataModel _dataModel;
        public ProjectLotNameUpdateDataAccess(ProjectLotNameUpdateParamDataModel dataModel)
        {
            _dataModel = dataModel;
        }

        public model GetDatabaseData()
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
                    cmd.CommandText = "[akonini.web.developer].[spUpdateProjectLotName]";
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(new SqlParameter { ParameterName = "@MasterProjectID", SqlDbType = SqlDbType.Int, Value = _dataModel.MasterProjectID });

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
