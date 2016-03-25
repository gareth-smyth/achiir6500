using System;
using achiir6500.server;

namespace achiir6500.server_mock
{
    public class MockReworkStation : IReworkStation
    {
        private int _currentRunCount;

        public Pc900ProgramRun Start(Pc900Program program)
        {
            _currentRunCount = 0;
            return new Pc900ProgramRun(program.id);
        }

        public int GetCurrentValue()
        {
            return _currentRunCount+= new Random().Next(0, 50);
        }
    }
}