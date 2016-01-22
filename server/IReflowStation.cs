using Newtonsoft.Json.Linq;

namespace achiir6500.server
{
    public interface IReflowStation
    {
        JObject GetPrograms();
    }
}