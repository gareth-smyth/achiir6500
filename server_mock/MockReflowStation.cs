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
            return JObject.Parse(@"{
                ""programs"": [
                     { 
                        ""id"": ""0"",
                        ""loop_counter"": ""1"", // 1-200 
                        ""steps"": { // max steps 8????????????????????
                            ""step"": {
                                ""ramp_rate"" : ""0.01"",
                                ""target"": ""25"",
                                ""dwell"": ""9999""
                            },
                            ""step"": {
                                ""ramp_rate"" : ""99.99"",
                                ""target"": ""30"",
                                ""dwell"": ""9999""
                            },
                            ""step"": {
                                ""ramp_rate"" : ""END"",
                                ""target"": """",
                                ""dwell"": """"
                            }
                        }
                    },
                    {
                        ""id"": 1,
                        ""steps"": {
                            ""step"": {
                                ""ramp_rate"" : ""1"",
                                ""target"": ""180"",
                                ""dwell"": ""30""
                            },
                            ""step"": {
                                ""ramp_rate"" : ""1"",
                                ""target"": ""210"",
                                ""dwell"": ""35""
                            },
                            ""step"": {
                                ""ramp_rate"" : ""END"",
                                ""target"": """",
                                ""dwell"": """"
                            }
                        }
                    }
                ]
            }");
        }
    }
}
