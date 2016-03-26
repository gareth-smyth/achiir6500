using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using achiir6500.server;

namespace achiir6500.server_mock
{
    class Program
    {
        static void Main(string[] args)
        {
            new AchiIr500Server(new MockNancyBootstraper()).Start();
            Console.ReadLine();
        }
    }
}
