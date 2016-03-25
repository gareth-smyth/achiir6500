namespace achiir6500.server
{
    public class Pc900ProgramStep
    {
        public double ramp { get; set; }
        public double level { get; set; }
        public double dwell { get; set; }

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