using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using achiir6500.server;
using Newtonsoft.Json.Linq;

namespace achiir6500.server_mock
{
    public class MockReflowStation : IReflowStation
    {
        public JObject GetPrograms()
        {
            throw new NotImplementedException();
        }
    }
}