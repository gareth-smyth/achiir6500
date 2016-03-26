using achiir6500.server;

namespace achiir6500.server_test
{
    class TestServerConfig : IServerConfig
    {
        public int GetProgramRunPollingIntervalMillis()
        {
            return 100;
        }
    }
}
