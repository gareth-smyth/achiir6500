using Newtonsoft.Json.Linq;

namespace achiir6500.server
{
    public interface IReworkStation
    {
        Pc900ProgramRun Start(Pc900Program program);
        int GetCurrentValue();
    }
}