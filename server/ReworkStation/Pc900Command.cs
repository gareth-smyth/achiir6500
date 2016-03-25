using System;
using System.Collections.Generic;

namespace achiir6500.server
{
    public class Pc900Command
    {
        public List<List<byte>> CommandsList { get; }
        public Func<List<byte>, CommandResponse> ResponseDelegate { get; }

        public Pc900Command(List<List<byte>> commandsList, Func<List<byte>, CommandResponse> startCommandResponseDelegate)
        {
            CommandsList = commandsList;
            ResponseDelegate = startCommandResponseDelegate;
        }
    }
}