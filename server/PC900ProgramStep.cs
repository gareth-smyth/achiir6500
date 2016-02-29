namespace achiir6500.server
{
    public class Pc900ProgramStep
    {
        public double ramp = 0;
        public double level = 0;
        public double dwell = 0;

        public Pc900ProgramStep()
        {
        }

        public Pc900ProgramStep(double ramp, double level, double dwell)
        {
            this.ramp = ramp;
            this.level = level;
            this.dwell = dwell;
        }
    }
}