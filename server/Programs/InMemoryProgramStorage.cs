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
            Pc900ProgramStep[] program0Steps = new Pc900ProgramStep[8];
            program0Steps[0] = new Pc900ProgramStep(1, 0, 360);
            program0Steps[1] = new Pc900ProgramStep(1, 190, 30);
            program0Steps[2] = new Pc900ProgramStep(1, 200, 15);
            program0Steps[3] = new Pc900ProgramStep(1, 210, 45);
            program0Steps[4] = new Pc900ProgramStep(1, 220, 30);
            program0Steps[5] = new Pc900ProgramStep(1, 230, 45);
            program0Steps[6] = new Pc900ProgramStep(1, 210, 20);
            program0Steps[7] = new Pc900ProgramStep(1, 180, 20);
            _programs.Add(new Pc900Program("iamaguid_1", "Reflow PS3 GPU", 1, program0Steps));

            Pc900ProgramStep[] program1Steps = new Pc900ProgramStep[8];
            program1Steps[0] = new Pc900ProgramStep(1, 0, 360);
            program1Steps[1] = new Pc900ProgramStep(1, 150, 30);
            program1Steps[2] = new Pc900ProgramStep(1, 200, 15);
            program1Steps[3] = new Pc900ProgramStep(1, 230, 45);
            program1Steps[4] = new Pc900ProgramStep(1, 25, 30);
            program1Steps[5] = new Pc900ProgramStep(1, 25, 45);
            program1Steps[6] = new Pc900ProgramStep(1, 25, 1);
            program1Steps[7] = new Pc900ProgramStep(1, 25, 1);
            _programs.Add(new Pc900Program("iamaguid_2", "Remove PS3 GPU", 1, program1Steps));
        }

        public List<Pc900Program> GetPrograms()
        {
            return _programs;
        }

        public void UpdatePrograms(List<Pc900Program> pc900Programs)
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

        public void DeletePrograms(List<Pc900Program> pc900Programs)
        {
            _programs.RemoveAll(program => pc900Programs.Select(deletedProgram => deletedProgram.id).Contains(program.id));
        }

        public Pc900Program GetProgram(string programId)
        {
            foreach (Pc900Program pc900Program in _programs)
            {
                if (pc900Program.id.Equals(programId))
                {
                    return pc900Program;
                }
            }
            return null;
        }
    }
}
