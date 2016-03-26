using System;
using achiir6500.server;

namespace achiir6500.server_mock
{
    public class MockReworkStation : IReworkStation
    {
        private int _currentRunTemperature;
        private int _currentRunCounter;

        public Pc900ProgramRun Start(Pc900Program program)
        {
            _currentRunTemperature = 0;
            _currentRunCounter = 0;
            return new Pc900ProgramRun(program.id);
        }

        public int GetCurrentValue()
        {
            _currentRunCounter++;
            return _currentRunTemperature+= new Random().Next(0, 50);
        }

        public bool ProgramRunning()
        {
            return _currentRunCounter < 10;
        }
    }
}