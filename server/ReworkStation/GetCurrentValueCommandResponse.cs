using System.Runtime.CompilerServices;

namespace achiir6500.server
{
    public class GetCurrentValueCommandResponse : CommandResponse
    {
        public int Value { get; }

        public GetCurrentValueCommandResponse(int value)
        {
            Value = value;
        }
    }
}