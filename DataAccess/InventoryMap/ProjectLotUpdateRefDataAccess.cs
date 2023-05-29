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

using model = BusinessRef.Model.InventoryMap.ProjectLotUpdateRefReturnDataModel;

namespace DataAccess.InventoryMap
{
    public class ProjectLotUpdateRefDataAccess : IGetDatabaseData<model>
    {
        private readonly ProjectLotUpdateRefParamDataModel _dataModel;
        public ProjectLotUpdateRefDataAccess(ProjectLotUpdateRefParamDataModel dataModel)
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
                    cmd.CommandText = "[akonini.web.developer].[spGetUpdateProjectLotRef]";
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(new SqlParameter { ParameterName = "@MasterProjectID", SqlDbType = SqlDbType.Int, Value = _dataModel.MasterProjectID });
                    cmd.Parameters.Add(new SqlParameter { ParameterName = "@LotID", SqlDbType = SqlDbType.Int, Value = _dataModel.LotID });

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
                            returnDataModel.RecordData = new ProjectLotIndividualRefDataModel();
                            returnDataModel.StatusList = new List<ProjectLotStatusRefDataModel>();

                            if (reader.HasRows)
                            {
                                reader.Read();

                                returnDataModel.RecordData.ID = Convert.ToInt32(reader["ID"]);
                                returnDataModel.RecordData.LotID = Convert.ToInt32(reader["LotID"]);
                                returnDataModel.RecordData.MasterProjectID = Convert.ToInt32(reader["MasterProjectID"]);
                                returnDataModel.RecordData.LotName = reader["LotName"].ToString();
                                returnDataModel.RecordData.ProjectLotStatusID = Convert.ToInt32(reader["ProjectLotStatusID"]);
                                returnDataModel.RecordData.ProjectLotStatusName = reader["ProjectLotStatusName"].ToString();
                            }


                            reader.NextResult();

                            while(reader.Read())
                            {
                                returnDataModel.StatusList.Add(new ProjectLotStatusRefDataModel()
                                {
                                    ID = Convert.ToInt32(reader["ID"]),
                                    ProjectLotStatusName = reader["ProjectLotStatusName"].ToString()
                                });
                            }

                            reader.NextResult();
                            reader.Read();

                            returnDataModel.StatusCodeNumber = Convert.ToInt32(reader["StatusCodeNumber"]);
                        }
                    }

                }
            }


            return returnDataModel;
        }
    }
}
