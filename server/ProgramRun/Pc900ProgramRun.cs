using System;

namespace achiir6500.server
{
    public class Pc900ProgramRun
    {
        public string id;
        public string program_id;

        public Pc900ProgramRun(string program_id)
        {
            this.id = Guid.NewGuid().ToString();
            this.program_id = program_id;
        }
    }
}