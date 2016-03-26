using System.Collections.Generic;

namespace achiir6500.server
{
    public interface IProgramRunStorage
    {
        List<Pc900ProgramRun> GetProgramRuns();
        void AddToCurrentProgram(int value);
        void AddProgramRun(Pc900ProgramRun programRun);
        void ProgramStopped();
    }
}
