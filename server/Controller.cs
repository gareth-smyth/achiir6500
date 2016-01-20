using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nancy;

namespace achiir6500.server
{
    public class Controller : NancyModule
    {
        public Controller()
        {
            Get["/programs"] = _ => @"{
                [
                    ""program"" : { // max programs 10 (0-9)
                        ""id"": 0,
                        ""loop_cunter"": ""1"", // 1-200 
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
                        ""program"" : {
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
            }";
        }
    }
}
