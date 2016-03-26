using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace achiir6500.server
{
    public class StaticServerConfig : IServerConfig
    {
        public int GetProgramRunPollingIntervalMillis()
        {
            return 2500;
        }
    }
}
