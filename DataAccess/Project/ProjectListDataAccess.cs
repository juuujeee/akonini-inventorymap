using System.Data;
using System.Data.SqlClient;

using BusinessRef.Interfaces.Generics;
using BusinessRef.Model.Project;

using model = BusinessRef.Model.Project.ProjectListReturnDataModel;
using Microsoft.Extensions.Configuration;
using System.IO;
using System.Collections.Generic;
using System;

namespace DataAccess.Project
{
    public class ProjectListDataAccess : IGetDatabaseData<model>
    {
        private readonly ProjectListParamDataModel _dataModel;
        public ProjectListDataAccess(ProjectListParamDataModel dataModel)
        {
            _dataModel = dataModel;
        }

        public model GetDatabaseData()
        {
            IConfigurationBuilder builder = new ConfigurationBuilder();
            builder.AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"));

            var root = builder.Build();

            string connString = root.GetConnectionString("AKONINI_DB");

            model dataReturn = new model();
            using (SqlConnection con = new SqlConnection(connString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = con;
                    cmd.CommandText = "[akonini.web.developer].[spGetAllProject_Admin]";
                    cmd.CommandType = CommandType.StoredProcedure;


                    //cmd.Parameters.Add(new SqlParameter { ParameterName = "@MasterPersonID", SqlDbType = SqlDbType.Int, Value = _dataModel.MasterPersonID });


                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.GetSchemaTable().Rows[0].ItemArray[0].ToString() == "ErrorMessage")
                        {
                            if (reader.HasRows)
                            {
                                reader.Read();

                                dataReturn.HasError = true;
                                dataReturn.ErrorMessage = reader["ErrorMessage"].ToString();
                            }
                        }
                        else
                        {
                            dataReturn.ProjectList = new List<ProjectListRefDataModel>();

                            while (reader.Read())
                            {
                                dataReturn.ProjectList.Add(new ProjectListRefDataModel
                                {
                                    MasterProjectID = Convert.ToInt32(reader["MasterProjectID"]),
                                    ProjectName = reader["ProjectName"].ToString(),
                                    DateAdded = (DateTime)reader["DateAdded"],
                                    UnitTypeID = Convert.ToInt32(reader["UnitTypeID"]),
                                    UnitType = reader["UnitType"].ToString(),
                                    GMapLink = reader["GMapLink"].ToString(),
                                    RentOrSaleID = Convert.ToInt32(reader["RentOrSaleID"]),
                                    RentOrSale = reader["RentOrSale"].ToString(),
                                    IsRFO = reader["IsRFO"] as bool? ?? default,
                                    ProvinceID = Convert.ToInt32(reader["ProvinceID"]),
                                    ProvinceName = reader["ProvinceName"].ToString(),
                                    CityOrMuniID = Convert.ToInt32(reader["CityOrMuniID"]),
                                    CityName = reader["CityName"].ToString()
                                });
                            }

                        }
                    }
                }
            }
            return dataReturn;
        }
    }
}
