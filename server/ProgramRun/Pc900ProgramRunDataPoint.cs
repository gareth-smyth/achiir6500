using System;

namespace achiir6500.server
{
    public class Pc900ProgramRunDataPoint
    {
        public int index;
        public int value;
        public DateTime timestamp;

        public Pc900ProgramRunDataPoint(int index, int value, DateTime timestamp)
        {
            this.index = index;
            this.value = value;
            this.timestamp = timestamp;
        }
    }
}