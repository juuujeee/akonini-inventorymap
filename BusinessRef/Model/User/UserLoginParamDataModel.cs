using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessRef.Model.User
{
    public class UserLoginParamDataModel
    {
        public string UserName { get; set; }
        public string IStillLoveYou { get; set; }
        public int UserTypeID { get; set; } = 4;
        public string IPAddress { get; set; }

    }
}
