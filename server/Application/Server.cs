using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace achiir6500.server
{
    class Server
    {
        public static void Main()
        {
            new AchiIr500Server(new ProductionNancyBootstraper()).Start();
            Console.ReadLine();
        }
    }
}
