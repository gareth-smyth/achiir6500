using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json.Linq;

namespace achiir6500.server
{
    public class InMemoryProgramStorage : IProgramStorage
    {
        private readonly List<Pc900Program> _programs = new List<Pc900Program>();

        public InMemoryProgramStorage()
        {
            Pc900ProgramStep[] program0Steps = new Pc900ProgramStep[3];
            program0Steps[0] = new Pc900ProgramStep(0.01, 25, 9999);
            program0Steps[1] = new Pc900ProgramStep(99.99, 30, 9999);
            program0Steps[2] = new Pc900ProgramStep();
            _programs.Add(new Pc900Program("iamaguid_1", "Remove PS3 GPU", 1, program0Steps));

            Pc900ProgramStep[] program1Steps = new Pc900ProgramStep[3];
            program1Steps[0] = new Pc900ProgramStep(1, 180, 30);
            program1Steps[1] = new Pc900ProgramStep(1, 210, 35);
            program1Steps[2] = new Pc900ProgramStep();
            _programs.Add(new Pc900Program("iamaguid_2", "Reflow PS3 GPU", 2, program1Steps));
        }

        public JArray GetPrograms()
        {
            return JArray.FromObject(_programs);
        }

        public void UpdatePrograms(Pc900Program[] pc900Programs)
        {
            foreach(Pc900Program updatedProgram in pc900Programs)
            {
                Pc900Program existingProgram = _programs.FirstOrDefault(program => program.id == updatedProgram.id);
                if (existingProgram != null)
                {
                    existingProgram.name = updatedProgram.name;
                    existingProgram.loop_counter = updatedProgram.loop_counter;
                    existingProgram.steps = updatedProgram.steps;
                }
                else
                {
                    _programs.Add(updatedProgram);
                }
            }
        }
    }
}
