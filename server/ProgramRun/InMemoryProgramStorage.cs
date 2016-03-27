using System.Collections.Generic;

namespace achiir6500.server
{
    public class InMemoryProgramRunStorage : IProgramRunStorage
    {
        private readonly List<Pc900ProgramRun> _programRuns = new List<Pc900ProgramRun>();

        public List<Pc900ProgramRun> GetProgramRuns()
        {
            return _programRuns;
        }

        public void AddToCurrentProgram(int value)
        {
            _programRuns[0].AddDataPoint(value);
        }

        public void AddProgramRun(Pc900ProgramRun programRun)
        {
            if (_programRuns.Count == 0)
            {
                _programRuns.Add(programRun);
            }
            else
            {
                _programRuns[0] = programRun;
                _programRuns[0].finished = false;
            }
        }

        public void ProgramStopped()
        {
            _programRuns[0].finished = true;
        }
    }
}
