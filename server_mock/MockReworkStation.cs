using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using achiir6500.server;
using Newtonsoft.Json.Linq;

namespace achiir6500.server_mock
{
    public class MockReworkStation : IReworkStation
    {
        public Pc900ProgramRun Start(Pc900Program program)
        {
            return new Pc900ProgramRun(program.id);
        }
    }
}