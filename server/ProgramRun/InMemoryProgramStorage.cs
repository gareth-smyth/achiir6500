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
            _programRuns[0].data_points.Add(new Pc900ProgramRunDataPoint(value));
        }

        public void AddProgramRun(Pc900ProgramRun programRun)
        {
            _programRuns.Add(programRun);
        }
    }
}
