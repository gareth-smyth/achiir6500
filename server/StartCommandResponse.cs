using System.Runtime.CompilerServices;

namespace achiir6500.server
{
    public class StartCommandResponse
    {
        public Pc900ProgramRun Pc900ProgramRun { get; }
        public bool Succeeded { get; }

        public StartCommandResponse(Pc900ProgramRun pc900ProgramRun, bool succeeded)
        {
            Pc900ProgramRun = pc900ProgramRun;
            Succeeded = succeeded;
        }

        public static StartCommandResponse Success(Pc900ProgramRun pc900ProgramRun)
        {
            return new StartCommandResponse(pc900ProgramRun, true);
        }

        public static StartCommandResponse Failure(Pc900ProgramRun pc900ProgramRun)
        {
            return new StartCommandResponse(pc900ProgramRun, false);
        }
    }
}