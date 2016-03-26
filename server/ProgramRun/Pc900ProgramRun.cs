using System;
using System.Collections.Generic;

namespace achiir6500.server
{
    public class Pc900ProgramRun
    {
        public string id;
        public string program_id;
        public List<Pc900ProgramRunDataPoint> data_points;

        public Pc900ProgramRun(string programId)
        {
            this.id = Guid.NewGuid().ToString();
            this.program_id = programId;
            this.data_points = new List<Pc900ProgramRunDataPoint>();
        }
    }
}