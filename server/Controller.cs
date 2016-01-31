using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Nancy;

namespace achiir6500.server
{
    public class Controller : NancyModule
    {
        public Controller(IReflowStation reflowStation, IProgramStorage programStorage)
        {
            Get["/programs"] = _ => programStorage.GetPrograms().ToString();
        }
    }
}
