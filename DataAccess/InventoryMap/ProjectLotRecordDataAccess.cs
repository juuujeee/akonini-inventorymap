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

using model = BusinessRef.Model.InventoryMap.ProjectLotRecordReturnDataModel;

namespace DataAccess.InventoryMap
{
    public class ProjectLotRecordDataAccess : IGetDatabaseData<model>
    {
        private readonly ProjectLotRecordParamDataModel _dataModel;
        public ProjectLotRecordDataAccess(ProjectLotRecordParamDataModel dataModel)
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
                    cmd.CommandText = "[akonini.web.developer].[spGetProjectLotsV2]";
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
                            returnDataModel.ProjectLotRecords = new List<ProjectLotRecordDataModel>();
                            returnDataModel.ProjectLotStatusLegend = new List<ProjectLotStatusLegendDataModel>();

                            while(reader.Read())
                            {
                                returnDataModel.ProjectLotRecords.Add(new ProjectLotRecordDataModel
                                {
                                    ProjectLotID = Convert.ToInt32(reader["ProjectLotID"]),
                                    LotID = Convert.ToInt32(reader["LotID"]),
                                    ProjectLotStatusID = Convert.ToInt32(reader["ProjectLotStatusID"]),
                                    ProjectLotStatusName = reader["ProjectLotStatusName"].ToString(),
                                    LotName = reader["LotName"].ToString(),
                                    LegendColor = reader["LegendColor"].ToString()
                                });
                            }

                            reader.NextResult();

                            if(reader.HasRows)
                            {

                                while (reader.Read())
                                {
                                    returnDataModel.ProjectLotStatusLegend.Add(new ProjectLotStatusLegendDataModel
                                    {
                                        ID = Convert.ToInt32(reader["ID"]),
                                        MasterProjectID = Convert.ToInt32(reader["MasterProjectID"]),
                                        ProjectLotStatusID = Convert.ToInt32(reader["ProjectLotStatusID"]),
                                        LegendColor = reader["LegendColor"].ToString()
                                    });
                                }
                            }

                        }
                    }


                }
            }


            return returnDataModel;
        }
    }
}
