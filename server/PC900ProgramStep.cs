namespace achiir6500.server
{
    public class Pc900ProgramStep
    {
        public double ramp_rate = 0;
        public double target = 0;
        public double dwell = 0;

        public Pc900ProgramStep()
        {
        }

        public Pc900ProgramStep(double rampRate, double target, double dwell)
        {
            this.ramp_rate = rampRate;
            this.target = target;
            this.dwell = dwell;
        }
    }
}