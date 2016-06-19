using System;
using achiir6500.server;
using Newtonsoft.Json.Linq;

namespace achiir6500.cli
{
    class Program
    {
        static void Main(string[] args)
        {
            Pc900ProgramStep[] steps = {
                new Pc900ProgramStep(2, 3, 4),
                new Pc900ProgramStep(7, 8, 9)
            };
            Pc900Program program = new Pc900Program(Guid.NewGuid().ToString(), "Program1", 1, steps);
            var reworkStation = new ReworkStation();
            reworkStation.LoadRun(program);
            reworkStation.Start(program);
        }
    }
}
