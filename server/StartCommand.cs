using System;
using System.Collections.Generic;

namespace achiir6500.server
{
    public class StartCommand
    {
        public List<List<byte>> CommandsList { get; }
        public Func<List<byte>, StartCommandResponse> ResponseDelegate { get; }

        public StartCommand(List<List<byte>> commandsList, Func<List<byte>, StartCommandResponse> startCommandResponseDelegate)
        {
            CommandsList = commandsList;
            ResponseDelegate = startCommandResponseDelegate;
        }
    }
}