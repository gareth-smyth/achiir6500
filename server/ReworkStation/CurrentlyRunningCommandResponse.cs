namespace achiir6500.server
{
    public class CurrentlyRunningCommandResponse : CommandResponse
    {
        public bool Running { get; }

        public CurrentlyRunningCommandResponse(bool running)
        {
            Running = running;
        }
    }
}