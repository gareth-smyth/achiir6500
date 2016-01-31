namespace achiir6500.server
{
    internal class PC900Program
    {
        public Pc900ProgramStep[] steps;
        public string id;
        public string name;
        public int loop_counter;

        public PC900Program()
        {
            this.steps = new Pc900ProgramStep[10];
            for (int i = 0; i < 10; i++)
            {
                steps[i] = new Pc900ProgramStep();
            }
        }

        public PC900Program(string id, string name, int loopCounter, Pc900ProgramStep[] programSteps)
        {
            this.id = id;
            this.name = name;
            this.loop_counter = loopCounter;
            this.steps = new Pc900ProgramStep[10];
            for (int i = 0; i < 10; i++)
            {
                if (i < programSteps.Length)
                {
                    steps[i] = programSteps[i];
                }
                else
                {
                    steps[i] = new Pc900ProgramStep();
                }
            }
        }
    }
}