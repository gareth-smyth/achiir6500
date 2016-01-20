using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nancy;

namespace achiir6500.server
{
    class Controller : NancyModule
    {
        public Controller()
        {
            Get["/programs"] = _ => "Hi";
        }
    }
}
