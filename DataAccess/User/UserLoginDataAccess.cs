using System.Data;
using System.Data.SqlClient;

using BusinessRef.Interfaces.Generics;
using BusinessRef.Model.User;

using model = BusinessRef.Model.User.UserLoginReturnDataModel;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace DataAccess.User
{
    public class UserLoginDataAccess : IPostDatabaseData<model>
    {
        private readonly UserLoginParamDataModel _dataModel;

        public UserLoginDataAccess(UserLoginParamDataModel dataModel)
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
                    cmd.CommandText = "[akonini.web.developer].[spLoginUserPassword_InventoryMap]";
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(new SqlParameter { ParameterName = "@UserName", SqlDbType = SqlDbType.NVarChar, Value = _dataModel.UserName });
                    cmd.Parameters.Add(new SqlParameter { ParameterName = "@UserTypeID", SqlDbType = SqlDbType.Int, Value = _dataModel.UserTypeID });
                    cmd.Parameters.Add(new SqlParameter { ParameterName = "@IPAddress", SqlDbType = SqlDbType.NVarChar, Value = _dataModel.IPAddress });

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

                                returnDataModel.StatusCodeNumber = reader["StatusCodeNumber"] as int? ?? default;
                                returnDataModel.MasterPersonID = reader["MasterPersonID"] as int? ?? default;
                                returnDataModel.FirstName = reader["FirstName"].ToString();
                                returnDataModel.LastName = reader["LastName"].ToString();
                                returnDataModel.ReturnIStillLoveYou = reader["ReturnIStillLoveYou"].ToString();
                                returnDataModel.LoginCode = reader["LoginCode"].ToString();
                            }
                        }
                    }
                }
            }

            return returnDataModel;
        }
    }
}
