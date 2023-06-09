﻿using BusinessRef.Interfaces.Generics;
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

using model = BusinessRef.Model.InventoryMap.ProjectInventoryMapReturnDataModel;

namespace DataAccess.InventoryMap
{
    public class ProjectInventoryMapDataAccess : IGetDatabaseData<model>
    {
        private readonly ProjectInventoryMapParamDataModel _dataModel;
        public ProjectInventoryMapDataAccess(ProjectInventoryMapParamDataModel dataModel)
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
                    cmd.CommandText = "[akonini.web.developer].[spGetProjectInventoryMap_Admin]";
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
                            returnDataModel.InventoryMap = new List<ProjectInventoryMapRefDataModel>();

                            while(reader.Read())
                            {
                                returnDataModel.InventoryMap.Add(new ProjectInventoryMapRefDataModel
                                {
                                    ImageFileName = reader["ImageFileName"].ToString(),
                                    ImageCaption = reader["ImageCaption"].ToString(),
                                    ImageFileUrl = $"https://akonini-files.azurewebsites.net/svgfile/{Convert.ToBase64String(Encoding.UTF8.GetBytes(reader["ImageFileName"].ToString()))}"
                                });
                            }
                           
                        }
                    }


                }
            }


            return returnDataModel;
        }
    }
}
