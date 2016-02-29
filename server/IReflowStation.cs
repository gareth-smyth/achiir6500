using Newtonsoft.Json.Linq;

namespace achiir6500.server
{
    public interface IReflowStation
    {
        Pc900ProgramRun Start(Pc900Program program);
    }
}